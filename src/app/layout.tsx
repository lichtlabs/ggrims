import "./globals.css"
import * as fonts from "@/lib/fonts"
import QueryProvider from "./query-provider"
import React from "react"
import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { InfoBanner } from "@/components/info-banner"
import { GoogleAnalytics } from "@next/third-parties/google"

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
      <body
        className={cn("bg-[#F4EDE7] antialiased", fonts.firaMono.className)}
      >
        <QueryProvider>
          <InfoBanner />
          <main className="container mx-auto px-4 md:px-8">{children}</main>
          <Toaster />
        </QueryProvider>
        <GoogleAnalytics gaId="G-BLB169QSPS" />
      </body>
    </html>
  )
}
