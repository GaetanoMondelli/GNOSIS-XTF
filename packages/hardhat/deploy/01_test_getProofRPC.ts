import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { RLP } from "@ethereumjs/rlp";
import { Trie } from "@ethereumjs/trie";
import { defaultAbiCoder } from "@ethersproject/abi";
import { hexlify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";

import { Committer, Prover } from "../typechain-types";

export function padToEven(value: string): string {
  let a = value;

  if (typeof a !== "string") {
    throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
  }

  if (a.length % 2) a = `0${a}`;

  return a;
}

const hexToBytes = (hex: string): Uint8Array => {
  if (typeof hex !== "string") {
    throw new Error(`hex argument type ${typeof hex} must be of type string`);
  }

  if (!hex.startsWith("0x")) {
    throw new Error(`prefixed hex input should start with 0x, got ${hex.substring(0, 2)}`);
  }

  hex = hex.slice(2);

  if (hex.length % 2 !== 0) {
    hex = padToEven(hex);
  }

  const byteLen = hex.length / 2;
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i++) {
    const byte = parseInt(hex.slice(i * 2, (i + 1) * 2), 16);
    bytes[i] = byte;
  }
  return bytes;
};

const emptyHexlify = (_value: string) => {
  const hex = hexlify(_value, { hexPad: "left" });
  return hex === "0x00" ? "0x" : hex;
};

const rlpEncodeBlock = (_block: any) => {
  const values = [
    _block.parentHash,
    _block.sha3Uncles,
    _block.miner,
    _block.stateRoot,
    _block.transactionsRoot,
    _block.receiptsRoot,
    _block.logsBloom,
    _block.difficulty,
    _block.number,
    _block.gasLimit,
    _block.gasUsed,
    _block.timestamp,
    _block.extraData,
    _block.mixHash,
    _block.nonce,
    _block.baseFeePerGas,
  ];
  return RLP.encode(values.map(emptyHexlify));
};

// function getMappingSlot(key: any, slotNumber: any) {
//   const keyPadded = hexZeroPad(key, 32); // Pad the key to 32 bytes
//   const slotHex = hexZeroPad(hexlify(slotNumber), 32); // Slot number also padded to 32 bytes
//   const res = keccak256(keyPadded + slotHex.slice(2)); // Remove '0x' from slotHex
//   console.log("Slot hash:", res);
//   return res; // Remove '0x' from slotHex
// }

const getBlock = (_blockNumber: number, _hre: HardhatRuntimeEnvironment) =>
  _hre.ethers.provider.send("eth_getBlockByNumber", [hexlify(_blockNumber), false]);

const getRlpEncodedBlockHeaderByBlockNumber = async (_blockNumber: number, _hre: HardhatRuntimeEnvironment) => {
  const block = await getBlock(_blockNumber, _hre);
  return rlpEncodeBlock(block);
};
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const sepoliaChainId = 11155111;

  if (hre.network.name === "sepolia") {
    // get deployer address
    console.log("Deploying committer contract", deployer);
    const committer = "Committer";
    const prover = "Prover";

    const blockNumberCommiter = 9370742;

    await deploy(committer, {
      from: deployer,
      args: [sepoliaChainId],
      log: true,
    });

    await deploy(prover, {
      from: deployer,
      args: [sepoliaChainId, "0x0", deployer],
      log: true,
    });

    const committerContract = await hre.ethers.getContract<Committer>(committer, deployer);
    const proverContract = await hre.ethers.getContract<Prover>(prover, deployer);

    await proverContract.setAccount(await committerContract.getAddress());

    const nonce = await committerContract.nonce();

    const data = defaultAbiCoder.encode(["uint256"], [34]);

    const txResponse = await committerContract._generateCommitment(data);

    const txReceipt = await txResponse.wait();

    console.log("Transaction was included in block:", txReceipt?.blockHash);

    const comm = await committerContract.latestCommitment();

    console.log("Committer", comm, nonce);

    const address = await committerContract.getAddress();

    const provider = hre.ethers.provider;

    // Prepare the call for eth_getProof
    const method = "eth_getProof";
    const params = [
      address,
      ["0x0"], // Array of storage keys you want to prove; leave empty if none specific
      txReceipt?.blockHash, // Block number at which you want to get the proof
    ];

    // Using the provider to send a custom JSON-RPC request
    const proof = await provider.send(method, params);

    console.log("Proof data:", proof);

    const method2 = "eth_getStorageAt";
    const params2 = [address, "0x0", txReceipt?.blockHash];

    const storage = await provider.send(method2, params2);

    console.log("Storage proof data:", storage);

    const expectedValue = keccak256(
      defaultAbiCoder.encode(["uint256", "bytes", "uint256"], [sepoliaChainId, data, nonce]),
    );

    console.log("Expected value:", expectedValue);

    const blockData = await provider.getBlock(txReceipt?.blockHash || "");

    console.log("Block data:", blockData);

    const storageProofBytes = "0x" + proof?.storageProof[0].proof.map((s: any) => s.slice(2)).join("");

    console.log("Storage proof:", proof?.storageProof[0]);

    console.log("Storage proof bytes:", storageProofBytes, proof?.storageHash);

    // const proofObject = {
    //   blockNumber: txReceipt?.blockNumber || 0,
    //   nonce: nonce,
    //   storageRoot: proof?.storageHash,
    //   storageProof: storageProofBytes,
    // };

    //   accountProof: proof?.accountProof || [],
    // await proverContract._verifyProof(proofObject, data);

    const block = await getBlock(txReceipt?.blockNumber || 0, hre);
    const blockHeader = await getRlpEncodedBlockHeaderByBlockNumber(txReceipt?.blockNumber || 0, hre);
    console.log("Block header:", blockHeader);

    const accountsTrie = new Trie();
    const accountProofValueRlp = await accountsTrie.verifyProof(
      hexToBytes(block.stateRoot),
      hexToBytes(keccak256(address)),
      proof.accountProof.map(hexToBytes),
    );

    console.log("Account proof value RLP:", accountProofValueRlp);

    // const accounValueRlp = RLP.encode([
    //   hexToBytes(proof.nonce),
    //   hexToBytes("0x"),
    //   hexToBytes(proof.storageHash),
    //   hexToBytes(proof.codeHash),
    // ]);

    // SecureTrie
    const storageTrie = new Trie({ useKeyHashing: true });
    const storageProofValueRlp = await storageTrie.verifyProof(
      hexToBytes(proof.storageHash),
      hexToBytes("0x"),
      proof?.storageProof[0].proof.map(hexToBytes),
    );

    const proofData = {
      blockNumber: txReceipt?.blockNumber || 0,
      accountProof: proof.accountProof,
      storageProof: proof.storageProof,
      accountProofRlp: RLP.encode(proof.accountProof.map((_part: string) => RLP.decode(_part))),
      blockHeader,
      storageProofRlp: RLP.encode(proof.storageProof[0].proof.map((_part: string) => RLP.decode(_part))),
    };

    const proofObject = {
      blockNumber: txReceipt?.blockNumber || 0,
      blockHeader: blockHeader,
      // accountProof: proofData.accountProofRlp,
      accountProof: proof.accountProof,
      nonce: nonce,
      storageRoot: proof?.storageHash,
      // storageProof: proofData.storageProofRlp,
    };

    console.log("Proof object:", proofObject);

    // const result = await proverContract._verifyProof(proofObject, data);
    // console.log("Proof verification result:", result);
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["committer"];
