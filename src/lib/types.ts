import { z } from "zod"
import { createEventSchema, createTicketSchema } from "./schema"

export type DynamicInputType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "time"
  | "datetime-local"
  | "number"
  | "range"
  | "color"
  | "file"
  | "url"
  | "search"
  | "tel"

export type DynamicInput = {
  name: string
  label: string
  type: DynamicInputType
  placeholder?: string
  options?: Array<{
    label: string
    value: string
  }>
  required?: boolean
}

export type Event = {
  id: string
  name: string
  description: string
  location: string
  event_start_date: string
  event_end_date: string
  created_at: Date
  updated_at: Date
}

export type Ticket = {
  id: string
  eventId: string
  name: string
  description: string
  price: string
  benefits: Array<string>
  status: "available" | "pending" | "sold"
  created_at: Date
  updated_at: Date
}

export type EventWithTicketInputs = Event & {
  inputs: Array<DynamicInput>
}

export type BuyTicketResponse = {
  ticket_amount: number
  attendees: Attendee[]
  ticket_ids: string[]
  link_id: number
  link_url: string
  title: string
  type: string
  amount: number
  redirect_url: string
  expired_date: string
  created_from: string
  status: number
  step: number
  is_address_required: number
  is_phone_number_required: number
}

export type Attendee = {
  id_line: string
  name: string
}

export type CreateEventSchema = z.infer<typeof createEventSchema>

export type CreateTicketSchema = z.infer<typeof createTicketSchema>
