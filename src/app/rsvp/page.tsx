import type { Metadata } from "next"

type RsvpPageProps = {
  searchParams: {
    eventId: string
  }
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RSVP",
    description: "RSVP for an event"
  }
}

export default function RsvpPage({ searchParams: { eventId } }: RsvpPageProps) {
  return (
    <div className="py-8">
      <h1 className="mb-14 text-2xl">Event Name</h1>
    </div>
  )
}
