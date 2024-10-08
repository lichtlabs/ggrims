import type { Metadata } from "next"
import { truncate } from "@/lib/utils"
import RsvpButton from "./components/rsvp-button"

export const metadata: Metadata = {
  title: "Upcoming",
  description: "Welcome to G'GRIMS. Here's what's happening soon."
}

type Event = {
  id: string
  name: string
  date: Date
  location: string
  description: string
}

const dummyUpcomingEvents: Array<Event> = [
  {
    id: "cm20chuf1000208laedi96994", // cuid
    name: "Halloween Party",
    date: new Date(),
    location: "The Great Hall",
    description: "We're having a Halloween Party"
  },
  {
    id: "cm20ci0hq000308la1liw7mkl",
    name: "Christmas Party",
    date: new Date(),
    location: "The Great Hall",
    description: "We're having a Christmas Party"
  },
  {
    id: "cm20cibin000408la617w8kvr",
    name: "New Year's Party",
    date: new Date(),
    location: "The Great Hall",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, unde laudantium. Qui odio non doloremque saepe quae similique in exercitationem. Harum explicabo voluptates iste accusamus delectus unde quibusdam corporis rerum!"
  }
]

export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="mb-14 text-2xl">Upcoming Events</h1>
      <ul className="space-y-4">
        {dummyUpcomingEvents.map((event) => (
          <li key={event.id} className="border-b border-black/[.08] pb-4">
            <div className="relative flex justify-between">
              <div>
                <h2 className="text-lg">{event.name}</h2>
                <p className="mb-2 text-sm text-indigo-600">
                  {event.location} {"<>"}{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm">{truncate(event.description, 54)}</p>
              </div>
              <div className="absolute right-0">
                <RsvpButton eventId={event.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
