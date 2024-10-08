import localFont from "next/font/local"
import { Fira_Mono } from "next/font/google"

const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
})

const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
})

const firaMono = Fira_Mono({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: "400"
})

export { geistSans, geistMono, firaMono }
