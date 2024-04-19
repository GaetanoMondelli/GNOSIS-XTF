"use client";

import React from "react";
import { sepolia, useContractWrite, useSwitchNetwork, useChainId, useNetwork } from "wagmi";
import { displayTxResult } from "~~/app/debug/_components/contract";
import { useTransactor } from "~~/hooks/scaffold-eth";
// import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function DepositController({
  quantity,
  setQuantity,
  requiredQuantity,
  tokenAddress,
  chainId,
}: {
  quantity: any;
  requiredQuantity: any;
  setQuantity: any;
  tokenAddress: any;
  chainId: any;
}) {
  const contractsData = getAllContracts(
    chainId
  );
  const writeTxn = useTransactor();
  const contractName = "ETFIssuingChain";
  const gnosischaidoChainId = 10200;
  const sepoliaChainId = 11155111;
  const contractSimpleName = "SimpleERC20"; 

  const {
    data: approve,
    isLoading,
    writeAsync: approveAsync,
  } = useContractWrite({
    address: tokenAddress,
    functionName: "approve",
    abi: contractsData[contractSimpleName].abi,
    args: [contractsData[contractName].address, quantity],
  });
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();


  return (
    <div>
      {/* <button
        onClick={async () => {
          const { data } = await refetch();
          setData(data);
          console.log(data);
        }}
        disabled={isFetching}
      >
        getOwner
      </button> */}
      {/* {(isFetReq0 || isFetReq1) && <p>Loading...</p>} */}
      <>
        {/* <p>{displayTxResult(data)}</p> */}
        <div
          //   flex direction row one next to the other
          style={{
            display: "flex",
            flexDirection: "row",
            // justifyContent: "space-between",
            width: "100%",
            gap: "50px",
          }}
        >
          <div>
            <p>Address:</p>
            {displayTxResult(tokenAddress)}
          </div>
          <div>
            <p>Chain:</p>
            {displayTxResult(chainId)}
          </div>
          <div>
            <p>Required:</p>
            {displayTxResult(requiredQuantity)}
          </div>
          {chainId === chain?.id && (
            <div>
              <p>Approve token for</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white size font-bold py-2 px-6 rounded-full"
                style={{ cursor: "pointer", fontSize: "12px" }}
                onClick={async () => {
                  if (approveAsync) {
                    try {
                      const makeWriteWithParams = () => approveAsync();
                      await writeTxn(makeWriteWithParams);
                      // onChange();
                    } catch (e: any) {
                      console.log(e);
                    }
                  }
                }}
              >
                Approve
              </button>
            </div>
          )}
          {chainId === chain?.id && (
            <div>
              <p>Quantity:</p>
              <input
                className="border border-gray-400 rounded-md"
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              ></input>
            </div>
          )}
          {chainId !== chain?.id && (
            <div>
              <p>Chain Sepolia </p>
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white size font-bold py-2 px-6 rounded-full"
                style={{ cursor: "pointer", fontSize: "12px" }}
                onClick={async () => {
                  if (switchNetwork) {
                    try {
                      await switchNetwork(sepoliaChainId);
                    } catch (e: any) {
                      console.log(e);
                    }
                  }
                }}
              >
                Switch Chain
              </button>
            </div>
          )}
          {/* {chainId === gnosischaidoChainId && (
            <div>
              <p>Deposit 100 token</p>
              <button
                onClick={async () => {
                  if (depositAsync) {
                    try {
                      const makeWriteWithParams = () => depositAsync();
                      await writeTxn(makeWriteWithParams);
                      // onChange();
                    } catch (e: any) {
                      console.log(e);
                      //   notification.error(message);
                    }
                  }
                }}
              >
                Deposit
              </button>
            </div>
          )} */}
        </div>
      </>
      <br></br>
    </div>
  );
}
