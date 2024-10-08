"use client"
import { useRouter } from "next/navigation"

export default function RsvpButton({ eventId }: { eventId: string }) {
  const router = useRouter()

  function navigate() {
    router.push(`/rsvp?eventId=${eventId}`)
  }

  return (
    <button onClick={navigate} className="underline">
      RSVP {"→"}
    </button>
  )
}
