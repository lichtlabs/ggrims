"use client"
import DynForm from "../components/dyn-form"
import apiClient from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

type EventTicketPageProps = {
  params: {
    eventId: string
  }
}

export default function EventTicketPage({ params }: EventTicketPageProps) {
  const { data } = useQuery({
    queryKey: ["event", params.eventId],
    queryFn: () => apiClient.getEvent(params.eventId),
    refetchOnWindowFocus: false,
    enabled: !!params.eventId
  })

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-2xl">{data?.data?.name}</h1>
      <p>{data?.data?.description}</p>
      {!!data?.data?.inputs && (
        <DynForm eventId={params.eventId} inputs={data?.data?.inputs} />
      )}
    </div>
  )
}
