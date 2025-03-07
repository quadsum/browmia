/// <reference path="../types/secretvaults.d.ts" />
import { orgConfig } from '../config';
import * as schema from './schema.json';
import { nilql } from '@nillion/nilql';
import dotenv from 'dotenv';
import { v4 } from 'uuid';
import {
  BrowmiaNodeTaskData,
  BrowmiaRawTaskData,
  BrowmiaTask,
  SecretKey,
} from '../types/secretvaults';
import { allFulfilled, createJwt, makeRequest } from '../utils';

dotenv.config();

const cluster = {
  nodes: orgConfig.nodes,
};

export const secretKey: SecretKey = {
  material: Buffer.from(orgConfig.orgCredentials.secretKey!, 'hex'),
  cluster,
  operations: orgConfig.operations,
  dump: () => ({}),
};

export async function initSecretVault(): Promise<any> {
  let schemaId = orgConfig.schemaId
  if (!schemaId) {
    //wrap in try catch block to ignore json input bug
    try {
      await createSchema(schema);
    } catch (error) {
      console.log(error)
    } finally {
      const schemas = await getSchemas();
      const schemasByName = schemas[0].flatMap((s: any) =>
        s.name === 'Browmia Task Storage Schema' ? [s._id] : [],
      );
      //pick the last item which is the lastly updated
      schemaId = schemasByName[schemasByName.length - 1];
    }
  }
  return {schema: schemaId};
}

export async function writeToSecretVault(
  schemaId: string,
  data: BrowmiaTask,
): Promise<any> {
  const [encryptedFile, encryptedPath] = await allFulfilled([
    encryptData(data.file),
    encryptData(data.path),
  ]);

  const dataPayload = {
    data: [
      {
        ...data,
        file: encryptedFile,
        path: encryptedPath,
      },
    ],
    schema: schemaId,
  };

  const results = [];
  for (const node of orgConfig.nodes) {
    const jwt = await createJwt(node.did);
    const result = await makeRequest(
      node.url,
      'data/create',
      jwt,
      dataPayload,
      'POST',
    );
    results.push({node: node.url, result});
  }
  return results;
}

export async function readFromSecretVault(
  schemaId: string,
  recordId: string,
): Promise<BrowmiaRawTaskData | undefined> {
  const dataPayload = {
    filter: {
      _id: recordId,
    },
    schema: schemaId,
  };

  const results: {node: string; result: BrowmiaNodeTaskData}[] = [];
  for (const node of orgConfig.nodes) {
    const jwt = await createJwt(node.did);
    const result = await makeRequest(
      node.url,
      'data/read',
      jwt,
      dataPayload,
      'POST',
    );

    if (result && result.data && result.data.length) {
      results.push({node: node.url, result});
    }
  }

  if (!results.length) {
    console.warn(
      `No records found for record ${recordId} and schema ${schemaId}`,
    );
    return;
  }

  const rawData = results[0].result.data[0];
  const [decryptedFile, decryptedPath] = await allFulfilled([
    decryptData(rawData.file['%share']),
    decryptData(rawData.path['%share']),
  ]);

  return {
    ...rawData,
    file: decryptedFile as string,
    path: decryptedPath as string,
  };
}

/**
 * Lists schemas from all nodes in the org
 *
 */
async function getSchemas(): Promise<any[]> {
  const results = [];
  for (const node of orgConfig.nodes) {
    const jwt = await createJwt(node.did);
    const result = await makeRequest(node.url, 'schemas', jwt, {}, 'GET');
    results.push({node: node.url, result});
  }
  return results.map(result => result.result.data);
}

/**
 * Creates a new schema on all nodes
 * @param {object} schema - The schema to create
 * @param {string} schemaName - The name of the schema
 * @param {string} schemaId - Optional: The ID of the schema
 * @returns {Promise<array>} Array of creation results from each node
 */
export async function createSchema(schema: any) {
  const schemaId = v4();
  const schemaPayload = {
    _id: schemaId,
    name: 'Browmia Task Storage Schema',
    keys: ['_id'],
    schema,
  };
  const results = [];
  for (const node of orgConfig.nodes) {
    const jwt = await createJwt(node.did);
    const result = await makeRequest(node.url, 'schemas', jwt, schemaPayload);

    console.log(result);
    results.push({node: node.url, result});
  }
  return results;
}

/**
 * Encrypt data into shares
 */
export const encryptData = async (
  data: string,
): Promise<{'%share': string | string[] | number[]}> => {
  try {
    let shares = await nilql.encrypt(secretKey, data);

    // Convert single-node configuration to be an array to match schema types.
    shares = Array.isArray(shares) ? shares : [shares];

    return {'%share': shares};
  } catch (error) {
    throw new Error(
      `Encryption failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

/**
 * Decrypt data back to original format
 */
export const decryptData = async (
  shares: string[] | string,
): Promise<string | Uint8Array | bigint> => {
  try {
    if (Array.isArray(shares) && shares.length === 1) {
      //convert to string for single-node clusters
      shares = shares[0];
    }
    const decrypted = await nilql.decrypt(secretKey, shares);
    return decrypted;
  } catch (error) {
    throw new Error(
      `Decryption failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};
