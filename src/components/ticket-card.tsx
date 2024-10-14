"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Check, Clock, Tag, Ticket } from "lucide-react"

interface TicketProps {
  eventId: string
  name: string
  description: string
  price: string
  benefits: Array<string>
  status: "available" | "pending" | "sold"
  count: number
}

export function TicketCard({
  ticket,
  selected
}: {
  ticket: TicketProps
  selected: boolean
}) {
  const statusColor = {
    available: "bg-green-500",
    pending: "bg-yellow-500",
    sold: "bg-red-500"
  }

  return (
    <Card
      className={cn(
        "w-full overflow-hidden",
        selected && "ring-2 ring-indigo-600"
      )}
    >
      <CardHeader className="border-b bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{ticket.name}</CardTitle>
          <Badge variant="secondary" className="uppercase">
            {ticket.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative p-6">
        <div className="mb-6">
          {ticket?.description?.split("\\n").map((line, index) => (
            <p key={index} className="mb-2 text-sm text-muted-foreground">
              {line}
            </p>
          ))}
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            <span className="font-bold md:text-xl">
              {/* IDR {Number(ticket.price).toLocaleString()} */}
              IDR {`"Redacted"`}
            </span>
          </div>
          <div className="flex items-center">
            <Ticket className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">
              {ticket.count} available
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <h4 className="mb-2 text-sm font-semibold">Benefits:</h4>
        <ul className="space-y-2">
          {ticket?.benefits?.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="bg-muted/20 p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Limited time offer
            </span>
          </div>
          {/* <Button variant="default">
            {ticket.status === "available"
              ? "Select"
              : ticket.status === "pending"
                ? "Sold Out"
                : "Sold Out"}
          </Button> */}
        </div>
      </CardFooter>
      <div className={`h-1 w-full ${statusColor[ticket.status]}`} />
    </Card>
  )
}
