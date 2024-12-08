import  Button  from "@/components/common/Button"
import Interaction from "@/interaction"

const SellInvoice = () => {
  const interaction = Interaction()
  return(
    <Button text="sell to market" onClick={async () => {
      const result = await (await interaction).createAndListInvoice("usd","invoice","23","435748454","15")
      console.log("result",result)
    }} />
  )
}

export default SellInvoice;