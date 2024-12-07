"use client";

import { currencies } from "../utils/currencies";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";

export default function SellInvoice() {
  const { address: userAddress } = useAccount();
  const [requests, setRequests] = useState<(Types.IRequestDataWithEvents | undefined)[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!userAddress) return;

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

        console.log("request payer", requests);

        setRequests(requests.map((request) => request.getData()));
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();
  }, [userAddress]);

  const filteredRequests = requests?.filter((request) => {
    const terms = searchQuery.toLowerCase();
    
    if (request?.payee?.value?.toLowerCase() === userAddress?.toLowerCase()) {
      return request?.requestId?.toLowerCase().includes(terms) ||
             request?.payer?.value?.toLowerCase().includes(terms) ||
             request?.payee?.value?.toLowerCase().includes(terms);
    }
    return false;
  });

  const totalPages = Math.ceil((filteredRequests?.length || 0) / itemsPerPage);
  const paginatedRequests = filteredRequests?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Invoices to Get Paid</h1>
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b border-gray-200 py-2 px-4">Created</th>
                <th className="border-b border-gray-200 py-2 px-4">Due Date</th>
                <th className="border-b border-gray-200 py-2 px-4">Request ID</th>
                <th className="border-b border-gray-200 py-2 px-4">Payer</th>
                <th className="border-b border-gray-200 py-2 px-4">Payee</th>
                <th className="border-b border-gray-200 py-2 px-4">Amount</th>
                <th className="border-b border-gray-200 py-2 px-4">Status</th>
                <th className="border-b border-gray-200 py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests?.map((request) => (
                <tr key={request?.timestamp} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                  <td className="border-b border-gray-200 py-2 px-4">
                    {new Date(request?.timestamp! * 1000).toLocaleDateString()}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    {request?.contentData?.dueDate 
                      ? new Date(request.contentData.dueDate).toString()
                      : 'No date'}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    {request?.requestId.slice(0, 4)}...{request?.requestId.slice(62, 66)}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    {request?.payer?.value.slice(0, 5)}...{request?.payer?.value.slice(39, 42)}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    {request?.payee?.value.slice(0, 5)}...{request?.payee?.value.slice(39, 42)}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    {request?.expectedAmount}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    <Badge variant={calculateStatus(
                      request?.state as string,
                      BigInt(request?.expectedAmount as number),
                      BigInt(request?.balance?.balance || 0)
                    ) === "Paid" ? "default" : "secondary"}>
                      {calculateStatus(
                        request?.state as string,
                        BigInt(request?.expectedAmount as number),
                        BigInt(request?.balance?.balance || 0)
                      )}
                    </Badge>
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    <button
                      onClick={() => {/* TODO: Implement sell to market logic */}}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Sell to Market
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const calculateStatus = (
  state: string,
  expectedAmount: bigint,
  balance: bigint
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
