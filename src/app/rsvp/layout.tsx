import type { Metadata } from "next"

export async function generateMetadata({
  searchParams: { eventId }
}: {
  searchParams: { eventId: string }
}): Promise<Metadata> {
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
