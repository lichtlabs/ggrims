import type { Metadata } from "next"
import EventsList from "./components/events-list"

export const metadata: Metadata = {
  title: "Upcoming",
  description: "Welcome to G'GRIMS. Here's what's happening soon."
}

export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="mb-14 text-2xl">Upcoming Events</h1>
      <ul className="space-y-4">
        <EventsList />
      </ul>
    </div>
  )
}
