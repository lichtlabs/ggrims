"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Check, Clock, Tag, Ticket, ChevronDown } from "lucide-react"
import Markdown from "react-markdown"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { sendGAEvent } from "@next/third-parties/google"

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
  selected,
  isAccordionOpen,
  status,
  onAccordionToggle
}: {
  ticket: TicketProps
  selected: boolean
  isAccordionOpen: boolean
  status: "available" | "unavailable"
  onAccordionToggle: (isOpen: boolean) => void
}) {
  const statusColor = {
    available: "bg-green-500",
    pending: "bg-yellow-500",
    sold: "bg-red-500"
  }

  const handleAccordionToggle = (value: boolean) => {
    onAccordionToggle(value)
    if (value) {
      sendGAEvent('event', 'view_ticket_benefits', {
        ticket_name: ticket.name,
        ticket_price: ticket.price
      })
    }
  }

  return (
    <Card
      className={cn(
        "w-full overflow-hidden",
        selected && "ring-2 ring-indigo-600"
      )}
    >
      <CardHeader className="border-b bg-muted/40 p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {ticket.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs uppercase">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative p-4">
        <div className="mb-4">
          <Markdown className="prose prose-sm [&>*>li]:list-disc [&>ul>li]:list-inside">
            {ticket?.description}
          </Markdown>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="mr-1 h-3 w-3" />
            <span className="text-sm font-semibold">
              IDR {Number(ticket.price).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <Ticket className="mr-1 h-3 w-3" />
            <span className="text-xs">{ticket.count} available</span>
          </div>
        </div>
        <Separator className="mt-3" />
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={isAccordionOpen ? "benefits" : ""}
          onValueChange={(value) => handleAccordionToggle(value === "benefits")}
        >
          <AccordionItem value="benefits">
            <AccordionTrigger className="py-2 text-sm font-medium">
              See Benefits
            </AccordionTrigger>
            <AccordionContent>
              <ul className="mt-1 space-y-1">
                {ticket?.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-1 mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="bg-muted/20 px-4 py-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span className="text-xs text-muted-foreground">
              Limited time offer
            </span>
          </div>
        </div>
      </CardFooter>
      <div className={`h-0.5 w-full ${statusColor[ticket.status]}`} />
    </Card>
  )
}
