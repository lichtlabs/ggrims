import type { Metadata } from "next"

export async function generateMetadata({
  params
}: {
  params: { eventId: string }
}): Promise<Metadata> {
  const eventId = params.eventId
  // const event = await getEvent(eventId)

  return {
    title: "Get ticket",
    description: "Get ticket for an event"
  }
}

type GetTicketLayoutProps = {
  children: React.ReactNode
}

export default function GetTicketLayout({ children }: GetTicketLayoutProps) {
  return children
}
