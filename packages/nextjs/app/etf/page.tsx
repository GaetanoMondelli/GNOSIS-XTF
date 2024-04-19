// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { use, useEffect, useState } from "react";
import { TxReceipt, displayTxResult } from "../debug/_components/contract";
import { DepositButton } from "./_components/DepositButton";
import { DepositController } from "./_components/DepositController";
import { MatrixView } from "./_components/MatrixView";
import PieToken from "./_components/PieToken";
import TokenBalanceAllowance from "./_components/tokenBalanceAllowance";
import "./index.css";
import { BigNumber } from "@ethersproject/bignumber";
import { Watermark } from "antd";
import type { NextPage } from "next";
import { TransactionReceipt } from "viem";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

const gnosischaidoChainId = 10200;
const sepoliaChainId = 11155111;

const ETF: NextPage = () => {
  const [bundleId, setBundleId] = useState<string>("1");
  const [bundles, setBundles] = useState<any>();
  const [vault, setVault] = useState<any>({});
  const [tokens, setTokens] = useState<any>([]);
  const [isMainChain, setIsMainChain] = useState<boolean>(false);

  const [quantityTokenA, setQuantityTokenA] = useState<any>("");
  const [quantityTokenB, setQuantityTokenB] = useState<any>("");
  const [quantityTokenC, setQuantityTokenC] = useState<any>("");

  const [etfTokenAddress, setEtfTokenAddress] = useState<any>("");

  // const [resultFee, setResultFee] = useState<any>();
  // const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const contractsData = getAllContracts(chain?.id);

  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;
  const { address: connectedAddress } = useAccount();

  const contractName = "ETFIssuingChain";

  const { isFetching: isFetToken, refetch: tokensFetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "getRequiredTokens",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  useEffect(() => {
    // Function to reload the page
    const reloadPage = () => {
      console.log("Network changed, reloading page...");
      window.location.reload();
    };

    // Set up an event listener for network changes
    window.ethereum.on("chainChanged", reloadPage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.ethereum.removeListener("chainChanged", reloadPage);
    };
  }, [chain]);

  const { isFetching: isETFTokenAddressFetching, refetch: etfTokenAddressFetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "etfToken",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  const { isFetching: isMainnetLoad, refetch: isMainnetFetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "isMainChain",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  const { isFetching, refetch } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "getVaultStates",
    abi: contractsData[contractName].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    },
  });

  const { isFetching: isVaultFet, refetch: vaultSate } = useContractRead({
    address: contractsData[contractName].address,
    functionName: "getVault",
    abi: contractsData[contractName].abi,
    args: [bundleId],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    },
  });

  // const etfTokenAddress = "0x106d24F579D77fbe71CBBF169f6Dc376208e25b5";

  useEffect(() => {
    async function fetchData() {
      if (isFetching) {
        return;
      }
      if (refetch) {
        const { data } = await refetch();
        setBundles(data);
      }
    }
    fetchData();
  }, [chain, isFetching, refetch]);

  useEffect(() => {
    async function fetchData() {
      if (isMainnetLoad) {
        return;
      }
      if (isMainnetFetch) {
        const { data } = await isMainnetFetch();
        setIsMainChain(data as boolean);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isETFTokenAddressFetching) {
        return;
      }
      if (etfTokenAddressFetch) {
        const { data } = await etfTokenAddressFetch();
        setEtfTokenAddress(data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isVaultFet) {
        return;
      }
      if (vaultSate) {
        const { data } = await vaultSate();
        console.log("vault", data);
        setVault(data);
      }
    }
    fetchData();
  }, [bundleId]);

  useEffect(() => {
    async function fetchData() {
      if (isFetToken) {
        return;
      }
      if (tokensFetch) {
        const { data } = await tokensFetch();
        console.log("tokens", data);
        setTokens(data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!tokens || tokens.length < 1) {
      return;
    }

    setQuantityTokenA(tokens[0]._quantity.toString());

    if (!tokens || tokens.length < 2) {
      return;
    }

    setQuantityTokenB(tokens[1]._quantity.toString());
    setQuantityTokenC(tokens[2]._quantity.toString());
  }, [tokens]);

  return (
    <Watermark
      zIndex={-9}
      font={{
        fontSize: "30",
      }}
      style={
        // take the whole screen in the behind all the elements
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: "100%",
        }
      }
      content={chain?.id === gnosischaidoChainId ? ["Gnosis", "Main Chain"] : ["Sepolia", "Side Chain"]}
      // image="https://w7.pngwing.com/pngs/459/4/png-transparent-xrp-symbol-black-hd-logo.png"
      height={230}
      width={250}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          color: "black",
          // centering the card
          margin: "auto",
          width: "1000px",
          marginTop: "30px",
        }}
        className="card"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // take the whole width
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 className="text-4xl my-0">ETF #{bundleId}</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              // centering the elements vertically
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              alt="tezos logo"
              width="200px"
              src="https://cryptomode.com/wp-content/uploads/2023/07/CryptoMode-Gnosis-Crypto-Payments.png"
            ></img>
          </div>
        </div>
        <br></br>
        {/* <p>{displayTxResult(contractsData[contractName].address)}</p> */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {bundles && <MatrixView setBundleId={setBundleId} bundleId={bundleId} bundles={bundles} />}
          {vault && vault._tokens && <PieToken input={vault}></PieToken>}
        </div>
        {/* {JSON.stringify(isMainChain)} */}
        <br></br>
        {isMainChain && etfTokenAddress && <TokenBalanceAllowance name={"ETF"} tokenAddress={etfTokenAddress} />}
        {tokens &&
          tokens.map((token: any, index: number) => {
            return chain?.id === token._chainId ? (
              <TokenBalanceAllowance
                key={index}
                chainId={chain?.id || ""}
                name={index.toString()}
                tokenAddress={token._address}
              />
            ) : (
              <b>
                {index} Token:{" "}
                {
                  // only show first 4 characters of the address and last 4 characters of the address
                  token._address.slice(0, 6) +
                    "..." +
                    token._address.slice(token._address.length - 4, token._address.length)
                }{" "}
                on another chain (chainId:{token._chainId})
              </b>
            );
          })}

        <br></br>
        <br></br>
        <h1>Collateral Vault</h1>
        <p>Bundle ID: {bundleId}</p>
        <b>Required Tokens</b>
        {tokens &&
          tokens.map((token: any, index: number) => {
            return (
              <>
                <DepositController
                  key={index}
                  quantity={index === 0 ? quantityTokenA : index === 1 ? quantityTokenB : quantityTokenA}
                  setQuantity={index === 0 ? setQuantityTokenA : index === 1 ? setQuantityTokenB : setQuantityTokenC}
                  requiredQuantity={token._quantity}
                  tokenAddress={token._address}
                  chainId={token._chainId}
                />
              </>
            );
          })}

        <br></br>
        <DepositButton
          bundleId={bundleId}
          state={vault?.state}
          tokenQuantities={tokens?.map((token: any) => ({
            _address: token._address,
            _quantity: token._quantity,
            _chainId: token._chainId,
          }))}
          chainId={chain?.id ?? gnosischaidoChainId}
        ></DepositButton>
      </div>
    </Watermark>
  );
};

export default ETF;
