// invoiceNFTMarketPlace contract 0x270B86CAdb48d1352858A1176799D7823EB09407


import {toast} from "react-hot-toast";
import { useAccount, useWriteContract, useReadContract } from "wagmi";

const marketplaceAddress = "0x270B86CAdb48d1352858A1176799D7823EB09407"; // InvoiceNFTMarketplace contract address
const invoiceNFTAddress = "0xb82d46669a849E1094bc5177988c09C0fa9c0D49"; // InvoiceNFT contract address

const marketplaceABI = [{"type":"constructor","inputs":[{"name":"_invoiceNFTAddress","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"bids","inputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"bidder","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum InvoiceNFTMarketplace.BidStatus"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"cancelListing","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createAndListInvoice","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"paymentChain","type":"string","internalType":"string"},{"name":"invoiceCurrency","type":"address","internalType":"address"},{"name":"settlementCurrency","type":"address","internalType":"address"},{"name":"description","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"unitPrice","type":"uint256","internalType":"uint256"},{"name":"discount","type":"uint256","internalType":"uint256"},{"name":"tax","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"getActiveListings","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct InvoiceNFTMarketplace.Listing[]","components":[{"name":"seller","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"},{"name":"isActive","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getBidsForToken","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct InvoiceNFTMarketplace.Bid[]","components":[{"name":"bidder","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum InvoiceNFTMarketplace.BidStatus"},{"name":"tokenId","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getInvoiceDetails","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"paymentChain","type":"string","internalType":"string"},{"name":"invoiceCurrency","type":"address","internalType":"address"},{"name":"settlementCurrency","type":"address","internalType":"address"},{"name":"description","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"unitPrice","type":"uint256","internalType":"uint256"},{"name":"discount","type":"uint256","internalType":"uint256"},{"name":"tax","type":"uint256","internalType":"uint256"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"isPaid","type":"bool","internalType":"bool"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"invoiceNFT","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract InvoiceNFT"}],"stateMutability":"view"},{"type":"function","name":"listInvoice","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"listings","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"seller","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"listingPrice","type":"uint256","internalType":"uint256"},{"name":"isActive","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"placeBid","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"platformFee","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"processBid","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"bidIndex","type":"uint256","internalType":"uint256"},{"name":"accept","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updatePlatformFee","inputs":[{"name":"_platformFee","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"BidAccepted","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"buyer","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"BidPlaced","inputs":[{"name":"bidder","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"BidRejected","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"bidIndex","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"InvoiceCreatedAndListed","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"creator","type":"address","indexed":true,"internalType":"address"},{"name":"listingPrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ListingCanceled","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ListingCreated","inputs":[{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"listingPrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}]



const Interaction = () => {
    const address = useAccount();
    const { data: hash, writeContract } = useWriteContract()
    const {data : readContract} = useReadContract();
    const marketplaceContractConfig = {
        marketplaceAddress,
        marketplaceABI
    }


    async function createAndListInvoice() { 
       
        writeContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'createAndListInvoice',
          args: [address.address,"Ethereum","0x1234567890123456789012345678901234567890","0x1234567890123456789012345678901234567890","Invoice for testing","1","100","0","0",(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60).toString(),"0"],
        })
      } 

      async function listInvoice() { 
       
        writeContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'listInvoice',
          args: ["0","2"],
        })
      }

      async function cancelListing() { 
       
        writeContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'cancelListing',
          args: ["0"],
        })
      }

      async function placeBid() { 
       
        writeContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'placeBid',
          args: ["0"],
        })
      }

      async function processBid() { 
       
        writeContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'processBid',
          args: ["0","0",true],
        })
      }

      async function getInvoiceDetails() {  //read-only
       //@ts-ignore
       
        readContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'getInvoiceDetails',
          args: ["0"],
        })
      }

      async function getActiveListings() {  //read-only
       //@ts-ignore
       
        readContract({
          address : marketplaceAddress,
          abi : marketplaceABI,
          functionName: 'getActiveListings',
          args: [],
        })
      }

      async function getBidsForToken() {  //read-only
       //@ts-ignore
        readContract({
          ...marketplaceContractConfig,
          functionName: 'getBidsForToken',
          args: ["0"],
        })
      }

      return {createAndListInvoice,listInvoice,cancelListing,placeBid,processBid,getInvoiceDetails,getActiveListings,getBidsForToken}
}

export default Interaction;