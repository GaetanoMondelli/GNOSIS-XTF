// File: aragon-web3-proofs.d.ts

declare module "@aragon/web3-proofs" {
  // Import any external types if necessary
  import Web3 from "web3";

  // Define the structure of the class or functions provided by the library
  export class Web3Proofs {
    constructor(provider?: Web3.providers.WebsocketProvider);

    getProof(address: string, storageKeys?: string[], blockNumber?: string | number, verify?: boolean): Promise<any>;

    verifyAccountProof(stateRoot: string | Buffer, address: string, proof: any): Promise<boolean>;

    verifyStorageProof(storageRoot: string | Buffer, storageProof: any): Promise<boolean>;

    encodeProof(proof: any): string;
  }
}
