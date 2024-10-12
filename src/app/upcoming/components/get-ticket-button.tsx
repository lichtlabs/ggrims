"use client"
import { useRouter } from "next/navigation"

export default function GetTicketButton({ eventId }: { eventId: string }) {
  const router = useRouter()

  function navigate() {
    router.push(`/tickets/${eventId}`)
  }

  return (
    <button onClick={navigate} className="underline">
      Get Ticket {"→"}
    </button>
  )
}
