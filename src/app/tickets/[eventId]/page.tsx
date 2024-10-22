"use client"
import { TicketCard } from "@/components/ticket-card"
import DynForm from "../components/dyn-form"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { createApiClient } from "@/lib/api-client"
import { Ticket } from "@/lib/types"
import Markdown from "react-markdown"

type EventTicketPageProps = {
  params: {
    eventId: string
  }
}

export default function EventTicketPage({ params }: EventTicketPageProps) {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0)

  const { data: eventRes } = useQuery({
    queryKey: ["event", params.eventId],
    queryFn: () => createApiClient().events.GetEvent(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId
  })

  const { data: ticketsRes } = useQuery({
    queryKey: ["tickets", params.eventId],
    queryFn: () =>
      createApiClient().events.ListDistinctTickets(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId,
    // 5 seconds
    refetchInterval: 5 * 1000
  })

  const event = eventRes?.data
  const tickets = ticketsRes?.data as unknown as Array<
    Omit<Ticket, "id"> & { count: number }
  >

  console.log(event)

  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <h1 className="text-2xl font-bold">{event?.name}</h1>
      <Markdown>{event?.description}</Markdown>
      <hr className="border-gray-600" />
      <h2 className="text-lg font-bold">Select a ticket</h2>
      <div className="grid gap-4">
        {!!tickets &&
          tickets?.map((ticket) => (
            <button
              key={ticket.name}
              onClick={() =>
                setSelectedTicketIndex(tickets?.indexOf(ticket) || 0)
              }
              className="w-full text-left"
            >
              <TicketCard
                ticket={ticket}
                selected={selectedTicketIndex === tickets?.indexOf(ticket)}
              />
            </button>
          ))}
      </div>
      {!!event?.inputs && (
        <DynForm
          eventId={params.eventId}
          ticket={tickets && tickets[selectedTicketIndex]}
          inputs={event.inputs}
        />
      )}
    </div>
  )
}
