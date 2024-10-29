import type { Metadata } from "next"
import EventsList from "./components/events-list"
import { commonMetadata } from "@/lib/consts"

export const metadata: Metadata = {
  title: "Upcoming",
  description: "Welcome to GGRIMS. Here's what's happening soon.",
  ...commonMetadata
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
