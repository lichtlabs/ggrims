import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to G'GRIMS"
}

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center">
      <div>
        <h1>Welcome to G'GRIMS</h1>
        <p>
          We're an event organizer. We're looking for people to attend our
          events
        </p>
        <Link href="/upcoming" className="underline">
          See our upcoming events {"→"}
        </Link>
      </div>
    </div>
  )
}
