import { UUID } from 'crypto';
//@ts-ignore
import { ES256KSigner, createJWT } from 'did-jwt';
import dotenv from 'dotenv';
import fs, { writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { orgConfig, vaultContract } from '../config';
import { BrowmiaTask } from '../types/secretvaults';

dotenv.config();

/**
 * Reads a JSON file from the filesystem and parses it into an object.
 * @returns The parsed JSON object.
 */
export function readStorageFile(): BrowmiaTask {
  const filePath = orgConfig.taskDataPath;
  const absolutePath = path.resolve(filePath);  
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const rawTaskData = {
    _id: v4(),
    taskId: process.env.TASK_ID!,
    path: absolutePath,
    file: fileContent,
  };

  return rawTaskData;
}

export function writeStorageFile(content: string): void {
  return writeFileSync(orgConfig.taskDataPath, content);
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create JWT signed with ES256K for one nodedid
 * @returns {Promise<string>} JWT token
 */
export async function createJwt(nodeDid: string): Promise<string> {
  // Create signer from private key
  const signer = ES256KSigner(
    Buffer.from(orgConfig.orgCredentials.secretKey!, 'hex'),
  );
  const ttl = 3600;
  const payload = {
    iss: orgConfig.orgCredentials.orgDid,
    aud: nodeDid,
    exp: Math.floor(Date.now() / 1000) + ttl,
  };

  const token = await createJWT(payload, {
    issuer: orgConfig.orgCredentials.orgDid!,
    signer,
  });

  return token;
}

/**
 * Makes an HTTP request to a node's endpoint
 * @param {string} nodeUrl - URL of the node
 * @param {string} endpoint - API endpoint
 * @param {string} token - JWT token for authentication
 * @param {object} payload - Request payload
 */
export async function makeRequest(
  nodeUrl: string,
  endpoint: string,
  token: string,
  payload: any,
  method = 'POST',
):Promise<{data:any[]} | undefined>{
  const response = await fetch(`${nodeUrl}/api/v1/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    console.log(`HTTP error! status: ${response.status}, body: ${text}`);
    return;
  }
  return await response.json() as {data: any[]};
}

/**
 * Utility function that returns only the fulfilled values (like Promise.all) and logs the rejected promises.
 * @param promises - An array of promises to be settled.
 * @returns A promise that resolves to an array of fulfilled values.
 */
export async function allFulfilled<T>(promises: Promise<T>[]): Promise<T[]> {
  const results = await Promise.allSettled(promises);

  const fulfilledValues: T[] = [];
  const rejectedReasons: any[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      fulfilledValues.push(result.value);
    } else if (result.status === 'rejected') {
      console.error(
        `Promise at index ${index} rejected with reason:`,
        result.reason,
      );
      rejectedReasons.push(result.reason);
    }
  });

  if (rejectedReasons.length > 0) {
    console.warn(`${rejectedReasons.length} promise(s) were rejected.`);
  }

  return fulfilledValues;
}

/**
 * Updates a vault with the given parameters.
 * @param vaultId - The ID of the vault to update.
 * @param schemaId - The schema ID for the vault.
 * @param recordId - The record ID for the vault.
 */
export async function updateVault(
  schemaId: UUID,
  recordId: UUID,
): Promise<string> {
  const tx = await vaultContract.updateVault(
    orgConfig.vaultId,
    schemaId,
    recordId,
  );

  await tx.wait();

  return tx.hash;
}

/**
 * Retrieves the details of a vault.
 * @param vaultId - The ID of the vault to retrieve.
 * @returns The vault details (schemaId, recordId, createdAt, updatedAt).
 */
export async function getVault(): Promise<
  | {schemaId: string; recordId: string; createdAt: number; updatedAt: number}
  | undefined
> {
  const result = await vaultContract.getVault(orgConfig.copyVaultId ?? orgConfig.vaultId);

  if (result && result.schemaId && result.recordId) {
    return {
      schemaId: result.schemaId,
      recordId: result.recordId,
      createdAt: Number(result.createdAt),
      updatedAt: Number(result.updatedAt),
    };
  }
}


export function getEnvVar(name: string, defaultValue?: string): any {
  const value = process.env[name]?.trim();
  return value ? value : defaultValue;
}