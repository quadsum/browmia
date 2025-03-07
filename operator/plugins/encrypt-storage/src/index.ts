import { UUID } from 'crypto';
import dotenv from 'dotenv';
import {
  initSecretVault,
  readFromSecretVault,
  writeToSecretVault,
} from './nillion/nillion';
import {
  delay,
  getVault,
  readStorageFile,
  updateVault,
  writeStorageFile,
} from './utils';

dotenv.config();

async function cleanup() {
  console.log('Handling gracefully exit...');
  //await syncData()

  process.exit(0); // Exit the process gracefully
}

// Catch SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  await cleanup();
});

// Catch SIGTERM
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  await cleanup();
});

//1: Initial Sync: Onchain Data --> Local Data
async function initialSyncData() {
  console.log('Running initial sync');
  const vaultData = await getVault();
  if (vaultData && vaultData.schemaId && vaultData.recordId) {
    const dataRead = await readFromSecretVault(
      vaultData.schemaId,
      vaultData.recordId,
    );

    if (dataRead && dataRead.path && dataRead.file) {
      writeStorageFile(dataRead.file);
    }
  }
}

//2: Sync: Local Data --> Onchain Data
async function syncData() {
  try {
    console.log('Syncing data...');
    const {schema} = await initSecretVault();
    const taskFsData = readStorageFile();
    const dataWritten = await writeToSecretVault(schema, taskFsData);
    const newIds = [
      ...new Set(
        dataWritten
          .flatMap((item: any) =>
            item.result?.data ? item.result.data.created : [],
          )
          .flat(),
      ),
    ];

    const txHash = await updateVault(schema, newIds[0] as UUID);

    if (txHash) {
      console.log(`Vault updated success! tx hash:  ${txHash}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const maxDelay = Number(process.env.INTERVAL || 60_000);

  await initialSyncData();
  while (true) {
    await Promise.allSettled([syncData()]);

    console.log('===== process DONE =====');
    await delay(maxDelay);
  }
}

main();
