import { z } from "zod"

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  event_start_date: z.string(),
  event_end_date: z.string(),
  inputs: z.string()
  // inputs: z.array(
  //   z.object({
  //     name: z.string(),
  //     label: z.string(),
  //     type: z.string(),
  //     placeholder: z.string(),
  //     required: z.boolean(),
  //     options: z.array(z.object({ label: z.string(), value: z.string() }))
  //   })
  // )
})
