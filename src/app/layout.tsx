import "./globals.css"
import type { Metadata } from "next"
import * as fonts from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import QueryProvider from "./query-provider"

export const metadata: Metadata = {
  title: {
    default: "G'GRIMS",
    absolute: "G'GRIMS",
    template: "%s | G'GRIMS"
  },
  description:
    "G'GRIMS 'Great gig running in my scene'. We're an event organizer."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", fonts.firaMono.className)}>
        <QueryProvider>
          <main className="container mx-auto px-4 md:px-0">{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
