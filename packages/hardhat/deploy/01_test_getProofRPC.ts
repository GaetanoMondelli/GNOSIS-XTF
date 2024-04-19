import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { RapidExample } from "../typechain-types";
import { Contract } from "@ethersproject/contracts";
// import { WrapperBuilder } from "@redstone-finance/evm-connector";
import * as Committer_ARTIFACTS from "../deployments/sepolia/Committer.json";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { defaultAbiCoder } from "@ethersproject/abi";
import { hexlify, hexZeroPad } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";

import { Committer, Prover } from "../typechain-types";

function getMappingSlot(key: any, slotNumber: any) {
  const keyPadded = hexZeroPad(key, 32); // Pad the key to 32 bytes
  const slotHex = hexZeroPad(hexlify(slotNumber), 32); // Slot number also padded to 32 bytes
  const res = keccak256(keyPadded + slotHex.slice(2)); // Remove '0x' from slotHex
  console.log("Slot hash:", res);
  return res; // Remove '0x' from slotHex
}

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

    const block = await provider.getBlock(txReceipt?.blockHash || "");

    console.log("Block data:", block);

    const storageProofBytes = "0x" + proof?.storageProof[0].proof.map((s: any) => s.slice(2)).join("");

    console.log("Storage proof:", proof?.storageProof[0]);

    console.log("Storage proof bytes:", storageProofBytes, proof?.storageHash);

    const proofObject = {
      blockNumber: txReceipt?.blockNumber || 0,
      nonce: nonce,
      storageRoot: proof?.storageHash,
      storageProof: storageProofBytes,
    };

    //   accountProof: proof?.accountProof || [],
    await proverContract._verifyProof(proofObject, data);
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["committer"];
