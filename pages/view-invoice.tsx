import Head from "next/head";
import { useAppContext } from "@/utils/context";
import { Spinner } from "@/components/ui";
import Button from "@/components/common/Button"
import Try from "@/utils/try";

export default function ViewInvoicePage() {
  const { requestNetwork, isDecryptionEnabled } = useAppContext();

  return (
    <>
      <Head>
        <title>View Invoice - Request Invoicing</title>
      </Head>
      <Try />
      <div className="container m-auto w-[100%]">
        {!requestNetwork ? (
          <Spinner />
        ) : (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">View Invoice</h1>
            {/* Add your invoice viewing logic here */}
          </div>
        )}
        <Button text="Trial" onClick={async () => {
            console.log("trying")
        }} />
      </div>
    </>
  );
} 