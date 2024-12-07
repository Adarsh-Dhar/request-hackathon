"use client";

import { currencies } from "@/utils/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";

// EDIT THIS TO SELECT THE USER'S ADDRESS
const userAddress = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";

export default function Home() {
  const [requests, setRequests] =
    useState<(Types.IRequestDataWithEvents | undefined)[]>();

  useEffect(() => {
    const fetchRequests = async () => {
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
      });

      try {
        const requests = await requestClient.fromIdentity({
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: userAddress,
        });

        setRequests(requests.map((request) => request.getData()));
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();
  }, []);

  

const calculateStatus = (
  state: string,
  expectedAmount: bigint,
  balance: bigint,
) => {
  if (balance >= expectedAmount) {
    return "Paid";
  }
  if (state === Types.RequestLogic.STATE.ACCEPTED) {
    return "Accepted";
  } else if (state === Types.RequestLogic.STATE.CANCELED) {
    return "Canceled";
  } else if (state === Types.RequestLogic.STATE.CREATED) {
    return "Created";
  } else if (state === Types.RequestLogic.STATE.PENDING) {
    return "Pending";
  }
};

const getSymbol = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.symbol;
};

const getDecimals = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.decimals;
};
}
