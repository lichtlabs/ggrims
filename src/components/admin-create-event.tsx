"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { events } from "@/lib/base-api-client"
import { UseFormReturn } from "react-hook-form"
import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { createApiClient } from "@/lib/api-client"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  date: z.date({
    required_error: "Event date is required."
  }),
  time: z.date({
    required_error: "Event time is required."
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters."
  }),
  theme: z.string().min(2, {
    message: "Theme must be at least 2 characters."
  }),
  tickets: z
    .array(
      z.object({
        name: z.string().min(2, "Ticket name must be at least 2 characters."),
        price: z.string().min(1, "Price must be a positive number."),
        quantity: z.number().int().min(1, "Quantity must be at least 1."),
        pax: z.number().int().min(1, "Pax must be at least 1."),
        inputs: z
          .array(
            z.object({
              key: z.string().min(2, "Input key must be at least 2 characters."),
              label: z.string().min(2, "Input label must be at least 2 characters."),
              placeholder: z.string().min(2, "Input placeholder must be at least 2 characters."),
              type: z.enum(
                [
                  "text",
                  "email",
                  "number",
                  "tel",
                  "url",
                  "password",
                  "search",
                  "date",
                  "datetime-local",
                  "month",
                  "week",
                  "time",
                  "color",
                  "file",
                  "range",
                  "checkbox",
                  "radio",
                  "hidden",
                  "image",
                  "submit"
                ],
                {
                  required_error: "Input type is required."
                }
              )
            })
          )
          .optional()
          .default([
            {
              key: "fullName",
              label: "Full Name",
              placeholder: "Enter your Full Name",
              type: "text"
            },
            {
              key: "email",
              label: "Email",
              placeholder: "Enter your Email",
              type: "email"
            }
          ])
      })
    )
    .min(1, "At least one ticket type is required."),
  imageUrl: z.string().url("Must be a valid URL.")
})

export function AdminCreateEventComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      theme: "",
      tickets: [
        {
          name: "",
          price: "0",
          quantity: 1,
          pax: 1,
          inputs: [
            {
              key: "fullName",
              label: "Full Name",
              placeholder: "Enter your Full Name",
              type: "text"
            },
            {
              key: "email",
              label: "Email",
              placeholder: "Enter your Email",
              type: "email"
            }
          ]
        }
      ],
      imageUrl: ""
    }
  })

  const {
    fields: ticketFields,
    append: appendTicket,
    remove: removeTicket
  } = useFieldArray({
    name: "tickets",
    control: form.control
  })

  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (eventData: events.CreateEventRequest) => {
      const token = await auth.getToken()
      if (!token) throw new Error("No token available")
      return createApiClient(token).events.CreateEvent(eventData)
    },
    onSuccess: () => {
      // Handle success (e.g., show a success message)
      console.log("Event created successfully!")
      toast({ title: "Success", description: "Event created successfully!" })
      router.push("/events")
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Failed to create event:", error)
      toast({ title: "Error", description: "Failed to create event." })
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(form.formState.errors, "errs")

    const eventData: events.CreateEventRequest = {
      title: values.title,
      description: values.description,
      date: values.date.toISOString(), // Convert Date to string
      time: values.time.getTime(), // Use the time input directly
      location: values.location,
      theme: values.theme,
      tickets: form.watch("tickets"),
      imageUrl: values.imageUrl
    }

    try {
      await mutation.mutateAsync(eventData)
    } catch (error) {
      console.error("Error during mutation:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Create New Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Beach Party" {...field} />
                </FormControl>
                <FormDescription>Enter a catchy title for your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Join us for a night of fun and dancing on the beach..." {...field} />
                </FormControl>
                <FormDescription>Provide a detailed description of your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select the date of your event.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="time"
                        {...field}
                        value={field?.value?.toLocaleTimeString()}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":").map(Number) // Convert to numbers
                          const date = form.watch("date") // Get the selected date
                          date.setHours(hours, minutes) // Set hours and minutes
                          field.onChange(date) // Update the time in the form
                        }}
                      />
                      <Clock className="ml-2 h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                  <FormDescription>Set the start time of your event.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <Input placeholder="Sunset Beach, Miami" {...field} />
                </FormControl>
                <FormDescription>Enter the location where the event will take place.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Theme</FormLabel>
                <FormControl>
                  <Input placeholder="Tropical Paradise" {...field} />
                </FormControl>
                <FormDescription>Specify the theme of your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h2 className="text-xl font-semibold mb-4">Ticket Types</h2>
            {ticketFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md mb-4">
                <h3 className="text-lg font-semibold mb-2">Ticket {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Name</FormLabel>
                        <FormControl>
                          <Input placeholder="VIP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="99.99"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.pax`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pax</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-2">Additional Inputs</h4>
                  <TicketInputs ticketIndex={index} form={form} />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => removeTicket(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Ticket
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                appendTicket({
                  name: "",
                  price: "0",
                  quantity: 1,
                  pax: 1,
                  inputs: []
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ticket Type
            </Button>
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormDescription>Provide a URL for the event image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Event</Button>
        </form>
      </Form>
    </div>
  )
}

function TicketInputs({ ticketIndex, form }: { ticketIndex: number; form: UseFormReturn<z.infer<typeof formSchema>> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `tickets.${ticketIndex}.inputs`
  })

  useEffect(() => {
    if (append) {
      append([
        {
          key: "fullName",
          label: "Full Name",
          placeholder: "Enter your Full Name",
          type: "text"
        },
        {
          key: "email",
          label: "Email",
          placeholder: "Enter your Email",
          type: "email"
        }
      ])
    }
  }, [append])

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-2 gap-4 mb-4">
          <FormField
            // disabled={index == 0 || index == 1}
            control={form.control}
            name={`tickets.${ticketIndex}.inputs.${index}.key`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Key</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. fullName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // disabled={index == 0 || index == 1}
            control={form.control}
            name={`tickets.${ticketIndex}.inputs.${index}.label`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Label</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // disabled={index == 0 || index == 1}
            control={form.control}
            name={`tickets.${ticketIndex}.inputs.${index}.placeholder`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Placeholder</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // disabled={index == 0 || index == 1}
            control={form.control}
            name={`tickets.${ticketIndex}.inputs.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Type</FormLabel>
                <Select
                  // disabled={index == 0 || index == 1}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      "text",
                      "email",
                      "number",
                      "tel",
                      "url",
                      "password",
                      "search",
                      "date",
                      "datetime-local",
                      "month",
                      "week",
                      "time",
                      "color",
                      "file",
                      "range",
                      "checkbox",
                      "radio",
                      "hidden",
                      "image",
                      "submit"
                    ].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!(index == 0 || index == 1) && (
            <Button type="button" variant="destructive" size="sm" className="mt-2" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Input
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ key: "", label: "", placeholder: "", type: "text" })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Input
      </Button>
    </div>
  )
}
