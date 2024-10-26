"use client"
import { TicketCard } from "@/components/ticket-card"
import DynForm from "../components/dyn-form"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { createApiClient } from "@/lib/api-client"
import { Ticket } from "@/lib/types"
import Markdown from "react-markdown"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { useRouter } from "next/navigation"

type EventTicketPageProps = {
  params: {
    eventId: string
  }
}

export default function EventTicketPage({ params }: EventTicketPageProps) {
  const router = useRouter()
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const { data: eventRes, isLoading: isEventLoading } = useQuery({
    queryKey: ["event", params.eventId],
    queryFn: () => createApiClient().events.GetEvent(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId
  })

  const { data: ticketsRes, isLoading: isTicketsLoading } = useQuery({
    queryKey: ["tickets", params.eventId],
    queryFn: () => createApiClient().events.ListDistinctTickets(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId,
    // 5 seconds
    refetchInterval: 5 * 1000
  })

  const event = eventRes?.data
  const tickets = ticketsRes?.data as unknown as Array<
    Omit<Ticket, "id"> & { count: number }
  >

  const isLoading = isEventLoading || isTicketsLoading

  useEffect(() => {
    if (!api) return
    setSelectedTicketIndex(api?.selectedScrollSnap() || 0)
    api.on("select", () => {
      setSelectedTicketIndex(api.selectedScrollSnap() || 0)
      setIsAccordionOpen(false) // Close accordion when carousel changes
    })
  }, [api])

  return (
    <div className="container mx-auto max-w-xl py-6">
      <Button
        variant="ghost"
        className="mb-2 text-sm"
        onClick={() => router.push("/upcoming")}
      >
        <ArrowLeft className="mr-1 h-3 w-3" /> Back to Events
      </Button>

      {!isLoading && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">{event?.name}</CardTitle>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>
                  Date:{" "}
                  {format(
                    event?.event_start_date as unknown as string,
                    "dd/MM/yy"
                  )}
                </span>
                <MapPin className="ml-3 mr-1 h-3 w-3" />
                <span>Location: {event?.location}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Markdown className="prose prose-sm dark:prose-invert">
                {event?.description}
              </Markdown>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Select a ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tickets && tickets.length > 0 && (
                <Carousel
                  setApi={setApi}
                  opts={{ align: "start", loop: false }}
                  className="w-full"
                >
                  <CarouselContent>
                    {tickets
                      ?.sort((a, b) => Number(a.price) - Number(b.price))
                      .map((ticket, index) => (
                        <CarouselItem key={ticket.name}>
                          <div className="p-1">
                            <TicketCard
                              ticket={ticket}
                              selected={selectedTicketIndex === index}
                              isAccordionOpen={
                                isAccordionOpen && selectedTicketIndex === index
                              }
                              onAccordionToggle={(isOpen) =>
                                setIsAccordionOpen(isOpen)
                              }
                            />
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </CardContent>
          </Card>

          {!!event?.inputs && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Registration Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DynForm
                  eventId={params.eventId}
                  ticket={tickets && tickets[selectedTicketIndex]}
                  inputs={event.inputs}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {isLoading && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
