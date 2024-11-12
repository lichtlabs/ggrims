import { AdminCreateEventComponent } from "@/components/admin-create-event"
import { Metadata } from "next"

export default function CreateEventPage() {
  return <AdminCreateEventComponent />
}

export const metadata: Metadata = {
  title: "Create Event",
  description: "Create a new event for your organization"
}
