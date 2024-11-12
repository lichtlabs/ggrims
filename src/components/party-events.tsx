"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { createApiClient } from "@/lib/api-client"
import { events } from "@/lib/base-api-client"
import { format } from "date-fns"

async function fetchEvents() {
  const response = await createApiClient().events.ListEvents()
  return response.data
}

export function PartyEvents() {
  const {
    data: events,
    error,
    isLoading
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">Upcoming Party Events</h1>
          <p className="mt-2 text-xl text-center text-gray-600 dark:text-gray-300">
            Discover and attend amazing parties near you
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event: events.EventDetail, index: number) => (
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
                  width={600}
                  height={400}
                />
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-2">{event.theme} Theme</Badge>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{format(new Date(event.time * 1000), "h:mm a")}</span>
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
