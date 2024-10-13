"use client"
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs"
import Link from "next/link"

export default function DashPage() {
  const user = useUser()
  return (
    <div className="py-16">
      <SignedOut>
        Oh.. <br /> you are not signed in. <br />
        <SignInButton>Please sign in to continue &rarr;</SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center">
          <UserButton />
          <span className="mt-4">
            ({user.user?.organizationMemberships[0].role})
          </span>
          Hello {user.user?.fullName}
          <div className="mt-2 text-red-500">
            <SignOutButton />
          </div>
        </div>
        {/* crate event and create ticket navigation */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <Link href="/admin/events/new" className="underline">
            Create Event {"→"}
          </Link>
          <Link href="/admin/tickets/new" className="underline">
            Create Ticket {"→"}
          </Link>
        </div>
      </SignedIn>
    </div>
  )
}
