export interface TicketInput {
  key: string
  label: string
  placeholder: string
  type: string // You can further restrict this to a union of string literals if needed
}

export interface Ticket {
  id: string
  name: string
  price: number
  quantity: number
  pax: number
  inputs: TicketInput[]
}

export interface Event {
  id: string
  title: string
  description: string
  date: string // Consider using Date type if you handle dates properly
  time: string
  location: string
  theme: string
  image: string
  tickets: Ticket[]
}

export interface UpcomingEvent {
  id: number
  name: string
  date: string
  ticketsSold: number
  revenue: number
}
