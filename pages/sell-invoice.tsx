"use client";

import { useEffect, useState } from "react";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { useMarketplaceInteraction, InvoiceListingParams } from "@/interaction";
import { toast } from "react-hot-toast";

export default function SellInvoice() {
  const { address: userAddress } = useAccount();
  const [requests, setRequests] = useState<(Types.IRequestDataWithEvents | undefined)[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { 
    createAndListInvoice, 
    isLoading 
  } = useMarketplaceInteraction();

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

        setRequests(requests.map((request) => request.getData()));
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to fetch invoices");
      }
    };

    fetchRequests();
  }, [userAddress]);

  const handleSellToMarket = async (request: Types.IRequestDataWithEvents | undefined) => {
    if (!request) {
      toast.error("Invalid request");
      return;
    }

    try {
      const invoiceParams: InvoiceListingParams = {
        paymentChain: "Ethereum",
        invoiceCurrency: request.currency || "0x0000000000000000000000000000000000000000",
        settlementCurrency: "0x0000000000000000000000000000000000000000",
        description: request.contentData?.reason || "Invoice from Request Network",
        quantity: "1",
        unitPrice: request.expectedAmount?.toString() || "0",
        discount: "0",
        tax: "0",
        deadline: request.contentData?.dueDate 
          ? Math.floor(new Date(request.contentData.dueDate).getTime() / 1000).toString()
          : (Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60).toString(),
        listingPrice: request.expectedAmount?.toString() || "0"
      };

      const result = await createAndListInvoice(invoiceParams);
      
      if (result) {
        // Optionally update local state or refetch requests
        toast.success("Invoice listed successfully!");
      }
    } catch (error) {
      console.error("Failed to sell invoice to market:", error);
      toast.error("Failed to list invoice");
    }
  };

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
                <tr 
                  key={request?.timestamp} 
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
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
                   
                  </td>
                  <td className="border-b border-gray-200 py-2 px-4">
                    <button
                      onClick={() => handleSellToMarket(request)}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-lg ${
                        isLoading 
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isLoading ? "Listing..." : "Sell to Market"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}