// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { useEffect, useState } from "react";
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
import { useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
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

const ETF: NextPage = () => {
  const contractsData = getAllContracts();
  const [bundleId, setBundleId] = useState<string>("1");
  const [bundles, setBundles] = useState<any>();
  const [vault, setVault] = useState<any>({});
  const [tokens, setTokens] = useState<any>([]);

  const [quantityTokenA, setQuantityTokenA] = useState<any>("");
  const [quantityTokenB, setQuantityTokenB] = useState<any>("");
  const [quantityTokenC, setQuantityTokenC] = useState<any>("");

  const [etfTokenAddress, setEtfTokenAddress] = useState<any>("0x106d24F579D77fbe71CBBF169f6Dc376208e25b5");

  // const [resultFee, setResultFee] = useState<any>();
  // const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

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
        // if type of data is Array, then it is a vault
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
    if (!tokens || tokens.length < 2) {
      return;
    }

    setQuantityTokenA(tokens[0]._quantity.toString());
    setQuantityTokenB(tokens[1]._quantity.toString());
    // setQuantityTokenC(tokens[2]._quantity.toString());
  }, [tokens]);

  return (
    <Watermark
      zIndex={-9}
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
      content="XRP Ledger"
      // image="https://w7.pngwing.com/pngs/459/4/png-transparent-xrp-symbol-black-hd-logo.png"
      height={130}
      width={150}
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
            <img width="200" src="data:image/png;base64,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" alt="XRP Ledger" />
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
        {/* {JSON.stringify(vault)} */}
        <br></br>
        {etfTokenAddress && <TokenBalanceAllowance isApprove name={"ETF"} tokenAddress={etfTokenAddress} />}
        {tokens &&
          tokens.map((token: any, index: number) => {
            return chain?.id === token._chainId ? (
              <TokenBalanceAllowance key={index} name={index.toString()} tokenAddress={token._address} />
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
        {etfTokenAddress}
        <b>Required Tokens</b>
        <DepositController
          quantity={quantityTokenA}
          setQuantity={setQuantityTokenA}
          requiredQuantity={tokens && tokens[0] ? tokens[0]._quantity : 0}
          tokenAddress={tokens && tokens[0] ? tokens[0]._address : ""}
          chainId={tokens && tokens[0] ? tokens[0]._chainId : ""}
        />
        <DepositController
          quantity={quantityTokenB}
          setQuantity={setQuantityTokenB}
          requiredQuantity={tokens && tokens[1] ? tokens[1]._quantity : 0}
          tokenAddress={tokens && tokens[1] ? tokens[1]._address : ""}
          chainId={tokens && tokens[1] ? tokens[1]._chainId : ""}
        />
        <DepositController
          quantity={quantityTokenB}
          setQuantity={setQuantityTokenB}
          requiredQuantity={tokens && tokens[2] ? tokens[2]._quantity : 0}
          tokenAddress={tokens && tokens[2] ? tokens[2]._address : ""}
          chainId={tokens && tokens[2] ? tokens[2]._chainId : ""}
        />
        <br></br>
        <br></br>
        <DepositButton
          bundleId={bundleId}
          state={vault?.state}
          tokenAddressA={tokens && tokens[0] ? tokens[0]._address : ""}
          quantityTokenA={quantityTokenA}
          tokenAddressB={tokens && tokens[1] ? tokens[1]._address : ""}
          quantityTokenB={quantityTokenB}
          tokenAddressC={tokens && tokens[2] ? tokens[2]._address : ""}
          quantityTokenC={quantityTokenC}
        ></DepositButton>
      </div>
    </Watermark>
  );
};

export default ETF;
