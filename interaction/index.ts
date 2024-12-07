import { useState } from 'react';
import { toast } from "react-hot-toast";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from 'viem';

const marketplaceAddress = "0xA1a0Fb31D33EcF1AD8fA5ccC259FeAa5508b3113"; // InvoiceNFTMarketplace contract address

//@ts-ignore
const marketplaceABI = [{"type":"constructor","inputs":[{"name":"_invoiceNFTAddress","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"bids","inputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"bidder","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum InvoiceNFTMarketplace.BidStatus"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createAndListInvoice","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"paymentChain","type":"string","internalType":"string"},{"name":"invoiceCurrency","type":"address","internalType":"address"},{"name":"settlementCurrency","type":"address","internalType":"address"},{"name":"description","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"unitPrice","type":"uint256","internalType":"uint256"},{"name":"discount","type":"uint256","internalType":"uint256"},{"name":"tax","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"getActiveListings","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct InvoiceNFTMarketplace.Listing[]","components":[{"name":"seller","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"},{"name":"isActive","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getBidsForToken","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct InvoiceNFTMarketplace.Bid[]","components":[{"name":"bidder","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum InvoiceNFTMarketplace.BidStatus"},{"name":"tokenId","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getInvoiceDetails","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"paymentChain","type":"string","internalType":"string"},{"name":"invoiceCurrency","type":"address","internalType":"address"},{"name":"settlementCurrency","type":"address","internalType":"address"},{"name":"description","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"unitPrice","type":"uint256","internalType":"uint256"},{"name":"discount","type":"uint256","internalType":"uint256"},{"name":"tax","type":"uint256","internalType":"uint256"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"isPaid","type":"bool","internalType":"bool"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"invoiceNFT","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract InvoiceNFT"}],"stateMutability":"view"},{"type":"function","name":"listings","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"seller","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"},{"name":"isActive","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"placeBid","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"platformFee","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"processBid","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"bidIndex","type":"uint256","internalType":"uint256"},{"name":"accept","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"BidAccepted","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"buyer","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"BidPlaced","inputs":[{"name":"bidder","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"BidRejected","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"bidIndex","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"InvoiceCreatedAndListed","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"creator","type":"address","indexed":true,"internalType":"address"},{"name":"listingPrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ListingCanceled","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ListingCreated","inputs":[{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"listingPrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}]

export interface InvoiceListingParams {
  paymentChain: string;
  invoiceCurrency: string;
  settlementCurrency: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  tax: string;
  deadline: string;
  listingPrice: string;
}

export const useMarketplaceInteraction = () => {
  const { address } = useAccount();
  const { writeContract, isPending, error: writeError } = useWriteContract();
  const { 
    data: readData, 
    error: readError 
  } = useReadContract();

  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);

  const createAndListInvoice = async (params: InvoiceListingParams) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return null;
    }

    setIsLoading(true);
    
    try {
      const hash = await writeContract({
        address: marketplaceAddress,
        abi: marketplaceABI,
        functionName: 'createAndListInvoice',
        args: [
          address,
          params.paymentChain,
          params.invoiceCurrency,
          params.settlementCurrency,
          params.description,
          BigInt(params.quantity),
          parseEther(params.unitPrice),
          BigInt(params.discount),
          BigInt(params.tax),
          BigInt(params.deadline),
          parseEther(params.listingPrice)
        ]
      });
//@ts-ignore
      setTransactionHash(hash);
      toast.success("Invoice listing created successfully");

      // Wait for transaction confirmation
//@ts-ignore

      const transaction = await useWaitForTransactionReceipt({ hash });
      
      return transaction;
    } catch (err) {
      console.error("Failed to create invoice listing:", err);
      toast.error("Failed to create invoice listing");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelListing = async (tokenId: bigint) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return null;
    }

    setIsLoading(true);

    try {
      const hash = await writeContract({
        address: marketplaceAddress,
        abi: marketplaceABI,
        functionName: 'cancelListing',
        args: [tokenId]
      });
//@ts-ignore

      setTransactionHash(hash);
      toast.success("Listing canceled successfully");
//@ts-ignore

      const transaction = await useWaitForTransactionReceipt({ hash });
      return transaction;
    } catch (err) {
      console.error("Failed to cancel listing:", err);
      toast.error("Failed to cancel listing");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const placeBid = async (tokenId: bigint, bidAmount: bigint) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return null;
    }

    setIsLoading(true);

    try {
      const hash = await writeContract({
        address: marketplaceAddress,
        abi: marketplaceABI,
        functionName: 'placeBid',
        args: [tokenId],
        value: bidAmount
      });
//@ts-ignore

      setTransactionHash(hash);
      toast.success("Bid placed successfully");
//@ts-ignore

      const transaction = await useWaitForTransactionReceipt({ hash });
      return transaction;
    } catch (err) {
      console.error("Failed to place bid:", err);
      toast.error("Failed to place bid");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const processBid = async (tokenId: bigint, bidIndex: bigint, accept: boolean) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return null;
    }

    setIsLoading(true);

    try {
      const hash = await writeContract({
        address: marketplaceAddress,
        abi: marketplaceABI,
        functionName: 'processBid',
        args: [tokenId, bidIndex, accept]
      });
//@ts-ignore

      setTransactionHash(hash);
      toast.success(accept ? "Bid accepted successfully" : "Bid rejected");
//@ts-ignore

      const transaction = await useWaitForTransactionReceipt({ hash });
      return transaction;
    } catch (err) {
      console.error("Failed to process bid:", err);
      toast.error("Failed to process bid");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // const getInvoiceDetails = async (tokenId: bigint) => {
  //   try {
  //     const details = await readContract({
  //       address: marketplaceAddress,
  //       abi: marketplaceABI,
  //       functionName: 'getInvoiceDetails',
  //       args: [tokenId]
  //     });

  //     return details;
  //   } catch (err) {
  //     console.error("Failed to fetch invoice details:", err);
  //     toast.error("Failed to fetch invoice details");
  //     return null;
  //   }
  // };

  // const getActiveListings = async () => {
  //   try {
  //     const listings = await readContract({
  //       address: marketplaceAddress,
  //       abi: marketplaceABI,
  //       functionName: 'getActiveListings',
  //       args: []
  //     });

  //     return listings;
  //   } catch (err) {
  //     console.error("Failed to fetch active listings:", err);
  //     toast.error("Failed to fetch active listings");
  //     return null;
  //   }
  // };

  // const getBidsForToken = async (tokenId: bigint) => {
  //   try {
  //     const bids = await readContract({
  //       address: marketplaceAddress,
  //       abi: marketplaceABI,
  //       functionName: 'getBidsForToken',
  //       args: [tokenId]
  //     });

  //     return bids;
  //   } catch (err) {
  //     console.error("Failed to fetch bids:", err);
  //     toast.error("Failed to fetch bids");
  //     return null;
  //   }
  // };

  return {
    createAndListInvoice,
    cancelListing,
    placeBid,
    processBid,
    isLoading,
    transactionHash,
    writeError,
    readError
  };
};