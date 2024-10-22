import type { Metadata } from "next"
import React from "react"
import { createApiClient } from "@/lib/api-client"

export async function generateMetadata({
  params
}: {
  params: { eventId: string }
}): Promise<Metadata> {
  const event = await createApiClient().events.GetEvent(params.eventId)

  return {
    title: event.data.name,
    description: event.data.description,
  }
}

type GetTicketLayoutProps = {
  children: React.ReactNode
}

export default function GetTicketLayout({ children }: GetTicketLayoutProps) {
  return children
}
