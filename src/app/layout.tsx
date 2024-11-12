import type { Metadata } from "next"
import localFont from "next/font/local"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import RqProvider from "@/components/rq-provider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
})

export const metadata: Metadata = {
  title: "G'GRIMS Events",
  description: "We're excited to bring you the most thrilling events in town!"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <ClerkProvider dynamic>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <RqProvider>{children}</RqProvider>
          {/* </ThemeProvider> */}
        </body>
      </ClerkProvider>
    </html>
  )
}
