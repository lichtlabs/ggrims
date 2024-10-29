import { commonMetadata } from "@/lib/consts"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to GGRIMS",
  ...commonMetadata
}

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center">
      <div className="flex w-full flex-col items-center text-center">
        <h1 className="text-2xl">Welcome to GGRIMS</h1>
        <p className="mb-4">
          We&apos;re looking for people to attend our events
        </p>
        <Link href="/upcoming" className="underline">
          See our upcoming events {"→"}
        </Link>
      </div>
    </div>
  )
}
