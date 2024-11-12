"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Event } from "@/types"
import Image from "next/image"

// Sample event data
const events: Event[] = [
  {
    id: "1",
    title: "Neon Nights Rave",
    description: "Electrifying dance party with neon lights and top DJs.",
    date: "2024-06-15",
    time: "10:00 PM",
    location: "Warehouse 13, Downtown",
    image: "/placeholder.svg",
    theme: "Neon",
    tickets: []
  },
  {
    id: "2",
    title: "Roaring 20s Gala",
    description: "Step back in time with this glamorous 1920s themed party.",
    date: "2024-07-22",
    time: "08:00 PM",
    location: "Grand Ballroom, Luxury Hotel",
    image: "/placeholder.svg",
    theme: "Vintage",
    tickets: []
  },
  {
    id: "3",
    title: "Tropical Beach Bash",
    description: "Soak up the summer vibes at our tropical-themed beach party.",
    date: "2024-08-05",
    time: "02:00 PM",
    location: "Sunset Beach",
    image: "/placeholder.svg",
    theme: "Beach",
    tickets: []
  }
]

export function PartyEvents() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
            Upcoming Party Events
          </h1>
          <p className="mt-2 text-xl text-center text-gray-600 dark:text-gray-300">
            Discover and attend amazing parties near you
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                  width={600} // Specify the width
                  height={400} // Specify the height
                />
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-2">{event.theme} Theme</Badge>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/events/${event.id}`}>Get Tickets</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
