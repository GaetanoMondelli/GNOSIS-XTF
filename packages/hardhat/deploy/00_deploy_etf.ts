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

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  if (hre.network.name === "sepolia2") {
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

    const sepoliaHahiAddress = "0xFC2c9d0094c6D64F3a4e4C6BF30E2229F4268b70";
    const hyperlaneAdapterAddress = "0x6869B0EbdC183Ab4cFc297B32214B21A417E76B2";
    const hyperlaneReporterAddress = zeroAddress; // deployed in chiado (main chain for etf)
    const yahooAddress = zeroAddress; // deployed in chiado too(main chain for etf)
    const etfTokenAddress = zeroAddress; // deployed in chiado too(main chain only for etf token not in side chain)

    console.log("Required side tokens: ", requiredSideTokens);
    await deploy("ETFIssuingChain", {
      from: deployer,
      args: [
        chiadoChainId, // main chain id
        sepoliaChainId,
        requiredSideTokens,
        sepoliaHahiAddress,
        hyperlaneAdapterAddress,
        hyperlaneReporterAddress,
        yahooAddress,
        etfTokenAddress,
        tokenPerVault,
      ],
      log: true,
    });

    const etfSide = await hre.ethers.getContract<ETFIssuingChain>("ETFIssuingChain", deployer);

    // // await requiredSideTokens.map(async token => {
    // const t = await hre.ethers.getContract<SimpleERC20>("SimpleERC20", deployer);
    // await t.approve(await etfSide.getAddress(), BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    // });

    // const main ETF contract
    const mainETFAddress = "0x79aa80021eD7F22A1c494F851A8254733383B232";

    // set side chain params
    await etfSide.setSideChainParams(mainETFAddress, sepoliaMailBoxAddress, sepoliaISMAddress);
  }

  if (hre.network.name === "chiado") {
    // get simpleerc20 token at 0x13F5e337ea0fe2ff0470a6e29E4D10D6B0Da2c58
    // const tokenA = await hre.ethers.getContractAt("SimpleERC20", "0x3A9A620b1E8B151A575c067605150347887819E4");
    // await tokenA.mint(
    //   "0x2a1F5eB3e84e58e6F1e565306298B9dE1273f203",
    //   BigNumber.from(10000).mul(BigNumber.from(10).pow(18)).toString(),
    // );

  }

  if (hre.network.name === "chiado2") {
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

    const gnosisChiadoHashiAddress = "0xd07eF911359F161A2361a62c6281c66de639f8A6";
    const gnosisChiadohyperlaneAdapterAddress = "0x84827596bFd9D4e9f723d448c751D78Fa506F386";
    const gnosisChiadohhyperlaneReporterAddress = "0xAf775F72fC4158e4A4bD6EA4B389B09DF556BD46";
    const yahooAddress = "0x73a7d1B252300b2e2e9a1119D1E490C6F9bf9c9B";

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
      args: [
        chiadoChainId,
        chiadoChainId,
        requiredTokens,
        gnosisChiadoHashiAddress,
        gnosisChiadohyperlaneAdapterAddress,
        gnosisChiadohhyperlaneReporterAddress,
        yahooAddress,
        await etfToken.getAddress(),
        tokenPerVault,
      ],
      log: true,
    });
    const etf = await hre.ethers.getContract<ETFIssuingChain>("ETFIssuingChain", deployer);
    await etfToken.setOwner(await etf.getAddress());
    await sleep(4000);

    await etf.setMainChainParams(
      "0xb7979b6D6ff00E34Fb7b2823e825ba16232C3551", // _sideChainLock
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
