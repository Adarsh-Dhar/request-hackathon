// invoiceNFTMarketPlace contract 0x270B86CAdb48d1352858A1176799D7823EB09407


import {toast} from "react-hot-toast";
import { useAccount, useWriteContract, useReadContract } from "wagmi";

const marketplaceAddress = "0xF8EB20ec2aD3e80Fd91eb699ceb18A66B84Da894"; // InvoiceNFTMarketplace contract address


const marketplaceABI = [{"type":"constructor","inputs":[{"name":"_invoiceNFTAddress","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"bids","inputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"bidder","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum InvoiceNFTMarketplace.BidStatus"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createAndListInvoice","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"currency","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"min_price","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"getActiveListings","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct InvoiceNFTMarketplace.Listing[]","components":[{"name":"seller","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"},{"name":"isActive","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getBidsForToken","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct InvoiceNFTMarketplace.Bid[]","components":[{"name":"bidder","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum InvoiceNFTMarketplace.BidStatus"},{"name":"tokenId","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getInvoiceDetails","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"currency","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"min_price","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"invoiceNFT","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract InvoiceNFT"}],"stateMutability":"view"},{"type":"function","name":"listings","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"seller","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"},{"name":"isActive","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"placeBid","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"platformFee","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"processBid","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"bidIndex","type":"uint256","internalType":"uint256"},{"name":"accept","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"BidAccepted","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"buyer","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"BidPlaced","inputs":[{"name":"bidder","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"BidRejected","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"bidIndex","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"InvoiceCreatedAndListed","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"creator","type":"address","indexed":true,"internalType":"address"},{"name":"listingPrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ListingCanceled","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ListingCreated","inputs":[{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"listingPrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}]


export default async function Interaction(){
  const address = useAccount();
  const { data: hash, writeContract } = useWriteContract()
  const {data : readContract} = useReadContract();
  const marketplaceContractConfig = {
      marketplaceAddress,
      marketplaceABI
  }

  async function createAndListInvoice(currency : string, description : string, amount : string, deadline : string, minPrice : string) { 
     console.log("hi from createAndListInvoice ")
      const transactionHash = await writeContract({
        address : marketplaceAddress,
        abi : marketplaceABI,
        functionName: 'createAndListInvoice',
        args: [address.address, currency, description, amount, deadline, minPrice]
      })
      console.log("tx",transactionHash)
      return transactionHash;
    } 

    async function listInvoice() { 
      const transactionHash = await writeContract({
        address : marketplaceAddress,
        abi : marketplaceABI,
        functionName: 'listInvoice',
        args: ["0","2"],
      })
      return transactionHash;
    }

    async function cancelListing() { 
      const transactionHash = await writeContract({
        address : marketplaceAddress,
        abi : marketplaceABI,
        functionName: 'cancelListing',
        args: ["0"],
      })
      return transactionHash;
    }

    async function placeBid() { 
      const transactionHash = await writeContract({
        address : marketplaceAddress,
        abi : marketplaceABI,
        functionName: 'placeBid',
        args: ["0"],
      })
      return transactionHash;
    }

    async function processBid() { 
      const transactionHash = await writeContract({
        address : marketplaceAddress,
        abi : marketplaceABI,
        functionName: 'processBid',
        args: ["0","0",true],
      })
      return transactionHash;
    }

    return {
      createAndListInvoice,
      listInvoice,
      cancelListing,
      placeBid,
      processBid,
    }
}