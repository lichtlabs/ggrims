"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { createApiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { formatToIDR } from "@/lib/utils"
import { format } from "date-fns"

const apiClient = createApiClient()

const createPurchaseSchema = (selectedTicket: { inputs: { key: string; label: string }[] }) => {
  const baseSchema = {
    ticketType: z.string({
      required_error: "Please select a ticket type."
    }),
    quantity: z.number().int().positive().max(10, "Maximum 10 tickets per purchase.")
  }

  const inputSchema: Record<string, z.ZodString> = {}
  selectedTicket.inputs.forEach((input: { key: string; label: string }) => {
    inputSchema[input.key] = z.string().min(1, `${input.label} is required.`)
  })

  return z.object({
    ...baseSchema,
    ...inputSchema
  })
}

export function EventDetailComponent({ eventId }: { eventId: string }) {
  const {
    data: event,
    isLoading,
    error
  } = useQuery({
    queryKey: ["eventDetail", eventId],
    queryFn: () => apiClient.events.GetEventDetail(eventId)
  })

  const [selectedTicket, setSelectedTicket] = useState(event?.data.tickets[0] || { inputs: [] })
  const [purchaseSchema, setPurchaseSchema] = useState(createPurchaseSchema(selectedTicket))

  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      ticketType: event?.data.tickets[0]?.name || "",
      quantity: 1
    }
  })

  function onSubmit(values: z.infer<typeof purchaseSchema>) {
    const ticket = event?.data.tickets.find((t) => t.name === values.ticketType)
    if (!ticket) {
      toast({
        title: "Error",
        description: "Invalid ticket type selected.",
        variant: "destructive"
      })
      return
    }

    console.log("Purchase submitted:", { ...values, ticketName: ticket.name })
    toast({
      title: "Purchase Successful",
      description: `You have purchased ${values.quantity} ${ticket.name} ticket(s).`
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading event details: {error.message}</div>

  return (
    event && (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={event.data.image}
              alt={event.data.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">{event.data.title}</h1>
            <p className="text-gray-600 mb-4">{event.data.description}</p>
            <div className="flex items-center text-gray-500 mb-2">
              <CalendarDays className="mr-2 h-5 w-5" />
              <span>{new Date(event.data.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-2">
              <Clock className="mr-2 h-5 w-5" />
              <span>{format(new Date(event.data.time * 1000), "h:mm a")}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <MapPin className="mr-2 h-5 w-5" />
              <span>{event.data.location}</span>
            </div>
            <Separator className="my-6" />
            <h2 className="text-2xl font-semibold mb-4">Event Theme</h2>
            <p className="text-gray-600 mb-6">{event.data.theme}</p>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Purchase Tickets</CardTitle>
                <CardDescription>Select your ticket type and quantity</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="ticketType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              const newSelectedTicket =
                                event.data.tickets.find((t) => t.name === value) || event.data.tickets[0]
                              setSelectedTicket(newSelectedTicket)
                              setPurchaseSchema(createPurchaseSchema(newSelectedTicket))
                              form.reset({ ticketType: value, quantity: 1 })
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a ticket type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {event.data.tickets.map((ticket) => (
                                <SelectItem key={ticket.name} value={ticket.name}>
                                  {ticket.name} - {formatToIDR(parseFloat(ticket.price))}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Choose the type of ticket you want to purchase.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Enter the number of tickets you want to purchase (max 10).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedTicket.inputs.map((input) => (
                      <FormField
                        key={input.key}
                        control={form.control}
                        name={input.key as never}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{input.label}</FormLabel>
                            <FormControl>
                              <Input type={input.type} placeholder={input.placeholder} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button type="submit" className="w-full">
                      Purchase Tickets
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  )
}
