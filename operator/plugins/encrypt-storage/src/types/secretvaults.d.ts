interface Cluster {
  nodes: object[];
}

interface Operations {
  store?: boolean;
  match?: boolean;
  sum?: boolean;
}
interface OrgCredentials {
  secretKey?: string;
  orgDid?: string;
}

interface NodeConfig {
  url: string;
  did: string;
}

export class SecretKey {
  material?: object | number;
  cluster: Cluster;
  operations: Operations;
  protected constructor(cluster: Cluster, operations: Operations);
  /**
   * Return a secret key built according to what is specified in the supplied
   * cluster configuration and operation specification.
   */
  static generate(
    cluster: Cluster,
    operations: Operations,
    seed?: Uint8Array | Buffer | string | null,
  ): Promise<SecretKey>;
  /**
   * Return a JSON-compatible object representation of this key instance.
   */
  dump(): object;
  /**
   * Return an instance built from a JSON-compatible object representation.
   */
  static load(object: object): SecretKey;
}

export interface BrowmiaTask {
  _id: string;
  taskId: string;
  file: string;
  path: string;
}

export interface BrowmiaRawTaskEncryptedData {
  _id: string;
  taskId: string;
  path: {'%share': string[]};
  file: {'%share': string[]};
  _created: string;
  _updated: string;
}

export interface BrowmiaRawTaskData {
  _id: string;
  taskId: string;
  path: string;
  file: string;
  _created: string;
  _updated: string;
}

export interface BrowmiaNodeTaskData {
  data: BrowmiaRawTaskEncryptedData[];
}

export interface ChatHistory {
  role: 'ai' | 'user';
  timestamp: string;
  text: string;
}
