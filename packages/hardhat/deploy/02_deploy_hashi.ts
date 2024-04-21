import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  SimpleERC20,
  ETFIssuingChain,
  Hashi,
  Yaho,
  HyperlaneReporter,
  HeaderStorage,
  HyperlaneAdapter,
  GiriGiriBashi,
  IGiriGiriBashi,
} from "../typechain-types";
import * as CORE_DEPLOYMENT from "../../../bridge/artifacts/core-deployment-2024-04-19-15-37-56.json";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers, keccak256 } from "ethers";
import { hexZeroPad } from "@ethersproject/bytes";
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const [owner] = await hre.ethers.getSigners();
  const chiadoChainId = 10200;
  const sepoliaChainId = 11155111;
  const decimalFactor = BigNumber.from(10).pow(18);
  const tokenPerVault = BigNumber.from(100).mul(decimalFactor).toString();
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const sepoliaMailBoxAddress = CORE_DEPLOYMENT["sepolia"]["mailbox"];
  const sepoliaISMAddress = CORE_DEPLOYMENT["sepolia"]["messageIdMultisigIsm"];

  // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  if (hre.network.name === "chiado") {
    console.log("Dispatching chiado blocks to sepolia");
    const hyperlaneReporterAddress = "0xAf775F72fC4158e4A4bD6EA4B389B09DF556BD46"; 
    const hyperlaneReporter = await hre.ethers.getContractAt("HyperlaneReporter", hyperlaneReporterAddress, owner);
    const sepoliaHyperlaneAdapterAddress = "0x6869B0EbdC183Ab4cFc297B32214B21A417E76B2";

    // await hyperlaneReporter.setDomainByChainId(sepoliaChainId, sepoliaChainId);
    await hyperlaneReporter.dispatchBlocks(sepoliaChainId, sepoliaHyperlaneAdapterAddress, [9370742], {
      value: ethers.parseEther("0.06"),
    });
  }


  if (hre.network.name === "chiado2") {
    await deploy("Hashi", {
      from: deployer,
      args: [],
      log: true,
    });

    const hashi = await hre.ethers.getContract<Hashi>("Hashi", deployer);

    await deploy("Yaho", {
      from: deployer,
      args: [],
      log: true,
    });

    const yaho = await hre.ethers.getContract<Yaho>("Yaho", deployer);

    // phase 2

    const chiadoMailBoxAddress = CORE_DEPLOYMENT["chiado"]["mailbox"];

    // await deploy("HyperlaneAdapter", {
    //   from: deployer,
    //   args: [chiadoMailBoxAddress],
    //   log: true,
    // });

    // const hyperlaneAdapter = await hre.ethers.getContract("HyperlaneAdapter", deployer);

    await deploy("HeaderStorage", {
      from: deployer,
      args: [],
      log: true,
    });

    const headerStorage = (await hre.ethers.getContract("HeaderStorage", deployer)) as HeaderStorage;

    await deploy("HyperlaneReporter", {
      from: deployer,
      args: [await headerStorage.getAddress(), await yaho.getAddress(), chiadoMailBoxAddress],
      log: true,
    });

    const hyperlaneReporter = (await hre.ethers.getContract("HyperlaneReporter", deployer)) as HyperlaneReporter;
    await deploy("GiriGiriBashi", {
      from: deployer,
      args: [owner.address, await hashi.getAddress(), owner.address],
      log: true,
    });

    const giriGiriBashi = (await hre.ethers.getContract("GiriGiriBashi", deployer)) as GiriGiriBashi;

    const settings: IGiriGiriBashi.SettingsStruct = {
      quarantined: false,
      minimumBond: ethers.parseEther("1"),
      startId: 1,
      idDepth: 20,
      timeout: 500,
    };

    await giriGiriBashi.enableAdapters(chiadoChainId, [await hyperlaneReporter.getAddress()], [settings]);

    await giriGiriBashi.setThreshold(chiadoChainId, 1);

    // const yaruAddressOnSepolia = "0x802D794421799a23C21743745218b084E8203788";

    // test yaho to dispatch message
    // await yaho.dispatchMessageToAdapters(
    //   sepoliaChainId,
    //   1,
    //   yaruAddressOnSepolia,
    //   "0x0",
    //   [hyperlaneReporter],
    //   [hyperlaneAdapter],
    // );

    const sepoliaHyperlaneAdapterAddress = "0x6869B0EbdC183Ab4cFc297B32214B21A417E76B2";

    await hyperlaneReporter.setDomainByChainId(sepoliaChainId, sepoliaChainId);
    await hyperlaneReporter.dispatchBlocks(sepoliaChainId, sepoliaHyperlaneAdapterAddress, [9364080], {
      value: ethers.parseEther("0.06"),
    });

    // const header = await headerStorage.storeBlockHeader(9364080);
    const header = await headerStorage.headers(9364080);

    console.log("header", header);

    // await hyperlaneReporter.dispatchMessages(sepoliaChainId, hyperlaneAdapter, [1], ["0x"]);
  }

  if (hre.network.name === "sepolia2") {
    await deploy("Hashi", {
      from: deployer,
      args: [],
      log: true,
    });

    const hashi = await hre.ethers.getContract<Hashi>("Hashi", deployer);

    await deploy("GiriGiriBashi", {
      from: deployer,
      args: [owner.address, await hashi.getAddress(), owner.address],
      log: true,
    });

    const giriGiriBashi = (await hre.ethers.getContract("GiriGiriBashi", deployer)) as GiriGiriBashi;

    const settings: IGiriGiriBashi.SettingsStruct = {
      quarantined: false,
      minimumBond: ethers.parseEther("1"),
      startId: 1,
      idDepth: 20,
      timeout: 500,
    };

    const sepoliaMailBoxAddress = CORE_DEPLOYMENT["sepolia"]["mailbox"];

    await deploy("HyperlaneAdapter", {
      from: deployer,
      args: [sepoliaMailBoxAddress, CORE_DEPLOYMENT["sepolia"]["messageIdMultisigIsm"]],
      log: true,
    });

    const hyperlaneAdapter = (await hre.ethers.getContract("HyperlaneAdapter", deployer)) as HyperlaneAdapter;

    await giriGiriBashi.enableAdapters(chiadoChainId, [await hyperlaneAdapter.getAddress()], [settings]);

    await giriGiriBashi.setThreshold(chiadoChainId, 1);

    const chaidoReporterAddress = "0xAf775F72fC4158e4A4bD6EA4B389B09DF556BD46";
    const yahoAddressChiado = "0x73a7d1B252300b2e2e9a1119D1E490C6F9bf9c9B";

    const chaidoReporterAddressToBytes32 = hexZeroPad(chaidoReporterAddress, 32);

    await hyperlaneAdapter.setReporterByChain(chiadoChainId, chiadoChainId, chaidoReporterAddressToBytes32);

    console.log("adapteraddress", await hyperlaneAdapter.getAddress());

    await deploy("Yaru", {
      from: deployer,
      args: [await hashi.getAddress(), yahoAddressChiado, chiadoChainId],
      log: true,
    });
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["hashi"];
