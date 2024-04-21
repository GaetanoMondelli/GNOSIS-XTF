https://www.gnosis.io/

# 🏗 Deployment Guide


1. hardhat % npm run deploy-chiado

2. get the address of ETFIssuingChain from maicn chain chiado 0xF8e05F51C334c632e3D194a1A7c349033C5d9dd1

```
deploying "ETFIssuingChain" (tx: 0xc4b3a3af2239d40ff9354479f7f1ca2f56bb0ed594945d414db8b1cdf9c34e0a)...: deployed at 0xF8e05F51C334c632e3D194a1A7c349033C5d9dd1 with 6435684 gas
```

3. edit the depoy-etf script when we are passing the mainnet lock contract and update with 0xF8e05F51C334c632e3D194a1A7c349033C5d9dd1
4.  hardhat % npm run deploy-sepolia
5 et the address of ETFIssuingChain from maicn chain sepolia 0xb7979b6D6ff00E34Fb7b2823e825ba16232C3551
deploying "ETFIssuingChain" (tx: 0xd9d922f01171b18f1d9bfa1fde081c5c1879ef53f760b68295bfec06fcc89c4d)...: deployed at 0xb7979b6D6ff00E34Fb7b2823e825ba16232C3551 with 5975046 gas
6. update the side lock with 0xb7979b6D6ff00E34Fb7b2823e825ba16232C3551 and re run the  npm run deploy-chiado

NOTE: the deployment script will reuse the deployed contract and will onl;y update the sidechain param in chiado, if it redeploys well does not work and need to comment the part of deployment before! (Note the reusing..)

```
Nothing to compile
No need to generate any newer typings.
deploying "SimpleERC20" (tx: 0x997833562d211f1fb689235ab285d87b1b2b75054944e16126bd4a2cdd6e470d)...: deployed at 0x3A9A620b1E8B151A575c067605150347887819E4 with 850197 gas
reusing "SimpleERC20" at 0x3A9A620b1E8B151A575c067605150347887819E4
Required side tokens:  [
```

---------



