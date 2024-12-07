import { useEffect } from "react"
import Interaction from "@/interaction";

export const BuyListing = () => {
  const {getActiveListings} = Interaction()
  useEffect(() => {
    
      const fetchListings = async () => {
        const listings = await getActiveListings()
        console.log(listings)
      };
  
      fetchListings();
    
  })

  return (
    <div>
      hi from buy listings
    </div>
  )
}
 