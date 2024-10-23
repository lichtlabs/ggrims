"use client"
import { truncate } from "@/lib/utils"
import GetTicketButton from "./get-ticket-button"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { createApiClient } from "@/lib/api-client"
import type { Event } from "@/lib/types"

export default function EventsList() {
  const { data } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: () => createApiClient().events.ListUpcomingEvents(),
    refetchOnWindowFocus: false
  })

  const events = data?.data as unknown as Event[]

  return (
    <>
      {!events?.length && (
        <p>
          There are no events yet.
        </p>
      )}
      {events?.map((event) => (
        <li key={event.id} className="border-b border-black/[.08] pb-4">
          <div className="relative flex justify-between">
            <div>
              <h2 className="text-lg">{event.name}</h2>
              <p className="mb-2 text-sm text-indigo-600">
                {event.location} {"<>"}{" "}
                {format(event.event_start_date, "dd/MM/yy hh:mma")}
              </p>
              <p className="text-sm">{truncate(event.description, 54)}</p>
            </div>
          </div>
          <div className="w-full mt-4">
            <GetTicketButton eventId={event.id} />
          </div>
        </li>
      ))}
    </>
  )
}
