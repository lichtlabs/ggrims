import { z } from "zod"

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  event_start_date: z.string(),
  event_end_date: z.string(),
  inputs: z.string()
})

export const createTicketSchema = z.object({
  eventId: z.string().optional(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  benefits: z.string(),
  ticket_count: z.string(),
  min: z.string(),
  max: z.string(),
})
