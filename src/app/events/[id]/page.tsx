import { EventDetailComponent } from "@/components/app-events-id-page"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <EventDetailComponent eventId={id} />
}
