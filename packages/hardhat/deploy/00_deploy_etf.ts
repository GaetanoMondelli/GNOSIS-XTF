import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SimpleERC20, ETFIssuingChain } from "../typechain-types";
import * as CORE_DEPLOYMENT from "../../../bridge/artifacts/core-deployment-2024-04-19-15-37-56.json";
import { BigNumber } from "@ethersproject/bignumber";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const chiadoChainId = 10200;
  const sepoliaChainId = 11155111;
  const decimalFactor = BigNumber.from(10).pow(18);
  const tokenPerVault = BigNumber.from(100).mul(decimalFactor).toString();
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const sepoliaMailBoxAddress = CORE_DEPLOYMENT["sepolia"]["mailbox"];
  const sepoliaISMAddress = CORE_DEPLOYMENT["sepolia"]["messageIdMultisigIsm"];

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  if (hre.network.name === "sepolia") {
    const requiredSideTokens = [
      {
        _address: "",
        _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
        _chainId: sepoliaChainId,
        _contributor: deployer,
        // ZERP ADDRESS
        _aggregator: zeroAddress,
      },
    ];

    await deploy("SimpleERC20", {
      from: deployer,
      args: ["SIDEToken" + 0, "SIDETK" + 0, 0],
      log: true,
    });


    for (let i = 0; i < requiredSideTokens.length; i++) {
      await deploy("SimpleERC20", {
        from: deployer,
        args: ["SIDEToken" + i, "SIDETK" + i, 0],
        log: true,
      });

      const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
      // await t.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
      requiredSideTokens[i]._address = await t.getAddress();
    }

    console.log("Required side tokens: ", requiredSideTokens);
    await deploy("ETFIssuingChain", {
      from: deployer,
      args: [chiadoChainId, sepoliaChainId, requiredSideTokens, zeroAddress, tokenPerVault],
      log: true,
    });

    const etfSide = await hre.ethers.getContract<ETFIssuingChain>("ETFIssuingChain", deployer);

    // // await requiredSideTokens.map(async token => {
    // const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    // await t.approve(await etfSide.getAddress(), BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    // });

    // const main ETF contract
    const mainETFAddress = "0x39C07e48dfCAfd49A6e4be9ca0164c5Be9A505fc";

    // set side chain params
    await etfSide.setSideChainParams(mainETFAddress, sepoliaMailBoxAddress, sepoliaISMAddress);
  }

  if (hre.network.name === "chiado") {
    console.log("Deploying ETF contract");
    //deploy tokenA and tokenB contracts
    const requiredTokens = [
      {
        _address: "",
        _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
        _chainId: chiadoChainId,
        _contributor: deployer,
        _aggregator: "",
      },
      {
        _address: "",
        _quantity: BigNumber.from(200).mul(decimalFactor).toString(),
        _chainId: chiadoChainId,
        _contributor: deployer,
        _aggregator: "",
      },
    ];

    for (let i = 0; i < 1; i++) {
      await deploy("SimpleERC20", {
        from: deployer,
        args: ["Token" + i, "TK" + i, 0],
        log: true,
      });
      await deploy("MockAggregator", {
        from: deployer,
        args: [10 * i, 18],
        log: true,
      });
      const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
      // // get contract at 0x2C5e23Cdbff221B707D1a42577764586791B5074
      // // const t = await hre.ethers.getContractAt("SimpleERC20", "0x2C5e23Cdbff221B707D1a42577764586791B5074");
      // await t.mint(
      //   "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203",
      //   BigNumber.from(10000).mul(BigNumber.from(10).pow(18)).toString(),
      // );
      requiredTokens[i]._address = await t.getAddress();
      requiredTokens[i]._aggregator = await (await hre.ethers.getContract("MockAggregator", deployer)).getAddress();
      console.log("Token address: ", requiredTokens[i]._address);
      await sleep(4000);
    }


    for (let i = 1; i < 2; i++) {
      await deploy("SimpleERC20", {
        from: deployer,
        args: ["Token_2" + i, "TK2" + i, 0],
        log: true,
      });
      await deploy("MockAggregator", {
        from: deployer,
        args: [10 * i, 18],
        log: true,
      });
      const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
      // get contract at 0x2C5e23Cdbff221B707D1a42577764586791B5074
      // const t = await hre.ethers.getContractAt("SimpleERC20", "0x2C5e23Cdbff221B707D1a42577764586791B5074");
      await t.mint(
        "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203",
        BigNumber.from(10000).mul(BigNumber.from(10).pow(18)).toString(),
      );
      requiredTokens[i]._address = await t.getAddress();
      requiredTokens[i]._aggregator = await (await hre.ethers.getContract("MockAggregator", deployer)).getAddress();
      console.log("Token address: ", requiredTokens[i]._address);
      await sleep(4000);
    }


    await deploy("MockAggregator", {
      from: deployer,
      args: [5, 18],
      log: true,
    });

    const aggregatorForForeignToken = await hre.ethers.getContract<SimpleERC20>("MockAggregator", deployer);

    requiredTokens.push({
      _address: "0x5e3eFC5b603d0AfD11f664d8d58DA94159247f60",
      _quantity: BigNumber.from(100).mul(decimalFactor).toString(),
      _chainId: sepoliaChainId,
      _contributor: deployer,
      _aggregator: await aggregatorForForeignToken.getAddress(),
    });

    console.log("Required tokens: ", requiredTokens);

    // deploy etfToken contract
    await deploy("SimpleERC20", {
      from: deployer,
      args: ["ETFToken", "ETFT", 0],
      log: true,
    });
    const etfToken = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    console.log("ETF Token address: ", await etfToken.getAddress());

    await deploy("ETFIssuingChain", {
      from: deployer,
      args: [chiadoChainId, chiadoChainId, requiredTokens, await etfToken.getAddress(), tokenPerVault],
      log: true,
    });
    const etf = await hre.ethers.getContract<ETFIssuingChain>("ETFIssuingChain", deployer);
    await etfToken.setOwner(await etf.getAddress());
    await sleep(4000);


    await etf.setMainChainParams(
      "0x5e3eFC5b603d0AfD11f664d8d58DA94159247f60",
      sepoliaChainId,
      CORE_DEPLOYMENT["chiado"]["mailbox"],
      CORE_DEPLOYMENT["chiado"]["messageIdMultisigIsm"],
    );
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["etf"];
