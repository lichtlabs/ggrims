"use client"
import { sendGTMEvent } from "@next/third-parties/google"
import { useRouter } from "next/navigation"

export default function GetTicketButton({ eventId }: { eventId: string }) {
  const router = useRouter()

  function navigate() {
    sendGTMEvent({ 
      event: 'select_event', 
      event_id: eventId 
    })
    router.push(`/tickets/${eventId}`)
  }

  return (
    <button onClick={navigate} className="underline">
      Get Ticket {"→"}
    </button>
  )
}
