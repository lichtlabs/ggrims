"use client"
import { truncate } from "@/lib/utils"
import GetTicketButton from "./get-ticket-button"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { createApiClient } from "@/lib/api-client"
import type { Event } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: () => createApiClient().events.ListUpcomingEvents(),
    refetchOnWindowFocus: false
  })

  const events = data?.data as unknown as Event[]

  return (
    <>
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
          <div className="mt-4 w-full">
            <GetTicketButton eventId={event.id} />
          </div>
        </li>
      ))}
      {isLoading &&
        [1, 2, 3].map((i) => (
          <li key={i} className="mb-4 border-b border-black/[.08] pb-4">
            <div className="relative flex justify-between">
              <div className="w-full">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="mb-4 h-4 w-5/6" />
              </div>
            </div>
            <Skeleton className="h-8 w-[100px]" />
          </li>
        ))}
      {!isLoading && !events?.length && <p>There are no events yet.</p>}
    </>
  )
}
