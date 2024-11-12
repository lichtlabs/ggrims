import { HomePageComponent } from "@/components/home-page"
import { Metadata } from "next"

export default function Home() {
  return <HomePageComponent />
}

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to G'GRIMS"
}
