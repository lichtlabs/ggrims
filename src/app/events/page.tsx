import { PartyEvents } from "@/components/party-events"
import { Metadata } from "next"

export default function UpcomingPage() {
  return <PartyEvents />
}

export const metadata: Metadata = {
  title: "Upcoming Party Events",
  description: "Discover and attend amazing parties near you"
}
