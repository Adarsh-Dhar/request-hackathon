import * as React from "react"

import Button from "@/components/common/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardWithFormProps {
  dateCreated: string
  dueDate: string
  price: string
  amount: string
  owner: string
}

export function CardWithForm({ dateCreated, dueDate, price, amount, owner }: CardWithFormProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
        <CardDescription>View invoice information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium">Date Created</span>
            <span className="text-sm text-gray-600">{dateCreated}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium">Due Date</span>
            <span className="text-sm text-gray-600">{dueDate}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium">Price</span>
            <span className="text-sm text-gray-600">{price}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium">Amount</span>
            <span className="text-sm text-gray-600">{amount}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium">Owner</span>
            <span className="text-sm text-gray-600">{owner}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        
        <Button text="Buy" />
      </CardFooter>
    </Card>
  )
}
