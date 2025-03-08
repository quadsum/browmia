import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { getEnvVar } from '../utils';
dotenv.config();

if (!process.env.NILLION_ORG_SECRET_KEY)
  throw new Error('NILLION_ORG_SECRET_KEY is not defined');
if (!process.env.NILLION_ORG_DID)
  throw new Error('NILLION_ORG_DID is not defined');
if (!process.env.OPERATOR_PK) throw new Error('OPERATOR PK is not defined');
if (!process.env.VAULT_ID) throw new Error('VAULT_ID is not defined');

// Define the ABI for the Vault functions
const VAULT_FACET_ABI = [
  {
    inputs: [
      {internalType: 'bytes32', name: 'vaultId', type: 'bytes32'},
      {internalType: 'string', name: 'schemaId', type: 'string'},
      {internalType: 'string', name: 'recordId', type: 'string'},
    ],
    name: 'updateVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bytes32', name: 'vaultId', type: 'bytes32'}],
    name: 'getVault',
    outputs: [
      {internalType: 'bytes32', name: 'id', type: 'bytes32'},
      {internalType: 'string', name: 'schemaId', type: 'string'},
      {internalType: 'string', name: 'recordId', type: 'string'},
      {internalType: 'uint256', name: 'createdAt', type: 'uint256'},
      {internalType: 'uint256', name: 'updatedAt', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const orgConfig = {
  //only 1 node is currently enabled
  operations: {store: true},
  nodes: [
    {
      url: 'https://nildb-nx8v.nillion.network',
      did: 'did:nil:testnet:nillion1qfrl8nje3nvwh6cryj63mz2y6gsdptvn07nx8v',
    },
  ],
  orgCredentials: {
    secretKey: getEnvVar('NILLION_ORG_SECRET_KEY'),
    orgDid: getEnvVar('NILLION_ORG_DID'),
  },
  diamond: getEnvVar('BROWMIA_DIAMOND_ADDRESS','0x64942Ac86b6B87Eb5BD14B9023F554746eF7639b'),
  pk: getEnvVar('OPERATOR_PK'),
  rpc: getEnvVar('MONAD_RPC','https://testnet-rpc.monad.xyz'),
  vaultId: getEnvVar('VAULT_ID'),
  copyVaultId: getEnvVar('COPY_VAULT_ID'),
  schemaId: getEnvVar('SCHEMA_ID', '1878d419-4e39-40fc-92a6-7c8cf45c2975'),
  taskDataPath: getEnvVar('TASK_DATA_PATH', './storage')
};

const provider = new ethers.JsonRpcProvider(orgConfig.rpc);

const ethersWallet = new ethers.Wallet(orgConfig.pk, provider);

export const vaultContract = new ethers.Contract(
  orgConfig.diamond,
  VAULT_FACET_ABI,
  ethersWallet,
);
