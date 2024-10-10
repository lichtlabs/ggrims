import type { Metadata } from "next"

export async function generateMetadata({
  params
}: {
  params: { eventId: string }
}): Promise<Metadata> {
  const eventId = params.eventId
  // const event = await getEvent(eventId)

  return {
    title: "RSVP",
    description: "RSVP for an event"
  }
}

type RsvpLayoutProps = {
  children: React.ReactNode
}

export default function RsvpLayout({ children }: RsvpLayoutProps) {
  return children
}
