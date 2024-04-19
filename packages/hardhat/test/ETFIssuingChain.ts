import { expect } from "chai";
import { ethers } from "hardhat";
import { ETFIssuingChain, SimpleERC20, MockAggregator, Hashi, ShoyuBashi, MockAdapter } from "../typechain-types";
import { BigNumber } from "@ethersproject/bignumber";
import { Web3Proofs } from "@aragon/web3-proofs";

describe("Hyperlane Bridge", function () {
  // We define a fixture to reuse the same setup in every test.
  let owner: any;
  let etf: ETFIssuingChain;
  let etfToken: SimpleERC20;
  let tokenA: SimpleERC20;
  let tokenB: SimpleERC20;
  const domain = 42;
  const decimalFactor = BigNumber.from(10).pow(18);
  const tokenPerVault = BigNumber.from(100).mul(decimalFactor).toString();
  let requiredTokens: any[];
  let hashi: Hashi;
  let shoyuBashi: ShoyuBashi;

  const HASH_ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const HASH_GOOD = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const HASH_BAD = "0x0000000000000000000000000000000000000000000000000000000000000bad";

  before(async () => {
    [owner] = await ethers.getSigners();
    const etfLockFactory = await ethers.getContractFactory("ETFIssuingChain");
    const hashiFactory = await ethers.getContractFactory("Hashi");
    const shuSoFactory = await ethers.getContractFactory("ShoyuBashi");

    const simpleFactory = await ethers.getContractFactory("SimpleERC20");
    const aggregatorFactory = await ethers.getContractFactory("MockAggregator");

    hashi = (await hashiFactory.deploy()) as Hashi;
    shoyuBashi = (await shuSoFactory.deploy(owner, await hashi.getAddress())) as ShoyuBashi;
    const settings = {
      quarantined: false,
      minimumBond: ethers.parseEther("1"),
      startId: 1,
      idDepth: 20,
      timeout: 500,
    };

    const MockAdapter = await ethers.getContractFactory("MockAdapter");
    const firstmockAdapter = (await MockAdapter.deploy()) as MockAdapter;
    const secondMockAdapter = (await MockAdapter.deploy()) as MockAdapter;
    const DOMAIN_ID = 1;

    await firstmockAdapter.setHashes(
      DOMAIN_ID,
      [0, 1, 20, 21, 22, 23],
      [HASH_ZERO, HASH_GOOD, HASH_BAD, HASH_GOOD, HASH_BAD, HASH_ZERO],
    );
    await secondMockAdapter.setHashes(
      DOMAIN_ID,
      [0, 1, 20, 21, 22, 23],
      [HASH_ZERO, HASH_GOOD, HASH_GOOD, HASH_GOOD, HASH_GOOD, HASH_ZERO],
    );
    await shoyuBashi.enableAdapters(DOMAIN_ID, [
      await firstmockAdapter.getAddress(),
      await secondMockAdapter.getAddress(),
    ]);
    await shoyuBashi.setThreshold(DOMAIN_ID, 2);

    // Disagree
    // await shoyuBashi.getHash(DOMAIN_ID, 20, [await firstmockAdapter.getAddress(), await secondMockAdapter.getAddress()]);

    await shoyuBashi.getHash(DOMAIN_ID, 1, [await firstmockAdapter.getAddress(), await secondMockAdapter.getAddress()]);

    etfToken = (await simpleFactory.deploy("ETF Token", "ETF", 0)) as SimpleERC20;
    tokenA = (await simpleFactory.deploy("TokenA", "TKA", 18)) as SimpleERC20;
    tokenB = (await simpleFactory.deploy("TokenB", "TKB", 18)) as SimpleERC20;
    await tokenA.mint(owner.address, BigNumber.from(1000).mul(decimalFactor).toString());
    await tokenB.mint(owner.address, BigNumber.from(1000).mul(decimalFactor).toString());
    const aggrTokenA = (await aggregatorFactory.deploy(1, 18)) as MockAggregator;
    const aggrTokenB = (await aggregatorFactory.deploy(2, 28)) as MockAggregator;

    requiredTokens = [
      {
        _address: await tokenA.getAddress(),
        _quantity: BigNumber.from(10).mul(decimalFactor).toString(),
        _chainId: domain,
        _contributor: owner.address,
        _aggregator: await aggrTokenA.getAddress(),
      },
      {
        _address: await tokenB.getAddress(),
        _quantity: BigNumber.from(20).mul(decimalFactor).toString(),
        _chainId: domain,
        _contributor: owner.address,
        _aggregator: await aggrTokenB.getAddress(),
      },
    ];

    etf = (await etfLockFactory.deploy(domain, domain, requiredTokens, etfToken, tokenPerVault)) as ETFIssuingChain;
    await etfToken.setOwner(await etf.getAddress());
    await tokenA.approve(await etf.getAddress(), BigNumber.from(1000).mul(decimalFactor).toString());
    await tokenB.approve(await etf.getAddress(), BigNumber.from(1000).mul(decimalFactor).toString());
  });

  it("Should have deployed the etf lock", async function () {
    const etfAddress = await etf.getAddress();
    expect(await etfAddress).to.be.not.null;
  });

  it("Should be able to Mint the Vault", async function () {
    const depositInfo = {
      vaultId: 1,
      tokens: requiredTokens,
    };

    expect(await etfToken.balanceOf(owner.address)).to.be.equal(0);
    expect(await tokenA.balanceOf(await etf.getAddress())).to.be.equal(0);
    await etf.deposit(depositInfo);
    expect(await tokenA.balanceOf(await etf.getAddress())).to.be.equal(
      BigNumber.from(10).mul(decimalFactor).toString(),
    );
    expect(await etfToken.balanceOf(owner.address)).to.be.gt(0);
    const blockNumber = await ethers.provider.getBlockNumber();

    // // get hardhat provider
    // const provider = ethers.provider;
    // const web3proofs = new Web3Proofs(provider);
    // const proof = await web3proofs.getProof(contractAddress, [slot1, slot2], blockNumber)


  });
});
