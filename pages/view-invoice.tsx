import Head from "next/head";
import { useAppContext } from "@/utils/context";
import { Spinner } from "@/components/ui";
import Button from "@/components/common/Button"
import { Try } from "@/utils/try";
import { useState } from "react";

export default function ViewInvoicePage() {
  const { requestNetwork, isDecryptionEnabled, address, walletClient } = useAppContext();
  const [paymentStatus, setPaymentStatus] = useState("NOT_STARTED");
  const [buttonLoadingMessage, setButtonLoadingMessage] = useState("");

  const handleTry = async () => {
    try {
      console.log("trying");
      const { createAndPayRequest } = await Try({
        address,
        walletClient,
        setPaymentStatus,
        setButtonLoadingMessage
      });

      await createAndPayRequest({
        tier: "trial",
        amount: 0,
        requestParams: {
          payeeIdentity: address,
          payerIdentity: address,
          signerIdentity: address,
          expectedAmount: "0",
          paymentAddress: address,
          reason: "Trial request",
          currencyAddress: "0x0000000000000000000000000000000000000000" // Replace with actual token address
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>View Invoice - Request Invoicing</title>
      </Head>
      <div className="container m-auto w-[100%]">
        {!requestNetwork ? (
          <Spinner />
        ) : (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">View Invoice</h1>
            {/* Add your invoice viewing logic here */}
          </div>
        )}
        <Button 
          text={buttonLoadingMessage || "Trial"} 
          onClick={handleTry}
          disabled={paymentStatus === "PENDING"}
        />
      </div>
    </>
  );
} 