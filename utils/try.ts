import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { getRequestClient } from "../request-client";
import {
  CreateRequestParams,
  createRequestParameters,
} from "../request-client/create-request";

enum PaymentStatus {
  NOT_STARTED = "NOT_STARTED",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING", 
  ERROR = "ERROR",
}

interface TryParams {
  address: string;
  walletClient: any;
  setPaymentStatus: (status: PaymentStatus) => void;
  setButtonLoadingMessage: (message: string) => void;
}

export async function Try({
  address,
  walletClient,
  setPaymentStatus,
  setButtonLoadingMessage
}: TryParams) {
  if (!address) throw new Error("Account not initialized");
  if (!walletClient) throw new Error("Wallet client not initialized");

  const createAndPayRequest = async ({
    tier,
    amount,
    requestParams,
  }: {
    tier: string;
    amount: number;
    requestParams: CreateRequestParams;
  }) => {
    try {
      setPaymentStatus(PaymentStatus.PENDING);
      setButtonLoadingMessage("Creating request...");

      const requestCreateParameters = createRequestParameters(requestParams);
      console.log("Request parameters:", requestCreateParameters);

      const requestClient = getRequestClient(walletClient);
      console.log("Request client:", requestClient);

      const request = await requestClient.createRequest(requestCreateParameters);
      console.log("Created request:", request);

      setButtonLoadingMessage("Waiting for confirmation...");
      const confirmation = await request.waitForConfirmation();
      console.log("Request confirmation:", confirmation);

      setPaymentStatus(PaymentStatus.SUCCESS);
      setButtonLoadingMessage("");

      return request;

    } catch (error) {
      console.error(error);
      setButtonLoadingMessage("");
      setPaymentStatus(PaymentStatus.ERROR);
      throw error;
    }
  };

  return {
    createAndPayRequest
  };
}