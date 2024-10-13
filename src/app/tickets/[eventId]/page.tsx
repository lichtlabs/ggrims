"use client"
import { TicketCard } from "@/components/ticket-card"
import DynForm from "../components/dyn-form"
import apiClient from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

type EventTicketPageProps = {
  params: {
    eventId: string
  }
}

export default function EventTicketPage({ params }: EventTicketPageProps) {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0)

  const { data } = useQuery({
    queryKey: ["event", params.eventId],
    queryFn: () => apiClient.getEvent(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId
  })

  const { data: tickets } = useQuery({
    queryKey: ["tickets", params.eventId],
    queryFn: () => apiClient.listTickets(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId,
    // 5 seconds
    refetchInterval: 5 * 1000
  })

  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <h1 className="text-2xl font-bold">{data?.data?.name}</h1>
      <p>{data?.data?.description}</p>
      <hr className="border-gray-600" />
      <h2 className="text-lg font-bold">Select a ticket</h2>
      <div className="grid gap-4">
        {!!tickets &&
          !!tickets.data &&
          tickets?.data.map((ticket) => (
            <button
              key={ticket.name}
              onClick={() =>
                setSelectedTicketIndex(tickets?.data?.indexOf(ticket) || 0)
              }
              className="w-full text-left"
            >
              <TicketCard
                ticket={ticket}
                selected={
                  selectedTicketIndex === tickets?.data?.indexOf(ticket)
                }
              />
            </button>
          ))}
      </div>
      {!!data?.data?.inputs && (
        <DynForm
          eventId={params.eventId}
          ticket={tickets?.data?.[selectedTicketIndex]}
          inputs={data?.data?.inputs}
        />
      )}
    </div>
  )
}
