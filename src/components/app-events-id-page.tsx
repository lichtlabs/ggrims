"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

import { Event } from "@/types"

const event: Event = {
  id: "1",
  title: "Summer Beach Party",
  description: "Join us for a night of fun and dancing on the beach...",
  date: "2024-07-15",
  time: "20:00",
  location: "Sunset Beach, Miami",
  theme: "Tropical Paradise",
  image: "/placeholder.svg",
  tickets: [
    {
      id: "1",
      name: "General Admission",
      price: 50,
      quantity: 100,
      pax: 1,
      inputs: [
        {
          key: "fullName",
          label: "Full Name",
          placeholder: "Enter your full name",
          type: "text"
        },
        {
          key: "email",
          label: "Email",
          placeholder: "Enter your email",
          type: "email"
        }
      ]
    },
    {
      id: "2",
      name: "VIP",
      price: 100,
      quantity: 50,
      pax: 1,
      inputs: [
        {
          key: "fullName",
          label: "Full Name",
          placeholder: "Enter your full name",
          type: "text"
        },
        {
          key: "email",
          label: "Email",
          placeholder: "Enter your email",
          type: "email"
        },
        {
          key: "phoneNumber",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          type: "tel"
        }
      ]
    }
  ]
}

const createPurchaseSchema = (selectedTicket: {
  inputs: { key: string; label: string }[]
}) => {
  const baseSchema = {
    ticketType: z.string({
      required_error: "Please select a ticket type."
    }),
    quantity: z
      .number()
      .int()
      .positive()
      .max(10, "Maximum 10 tickets per purchase.")
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

export function EventDetailComponent() {
  const [selectedTicket, setSelectedTicket] = useState(event.tickets[0])
  const [purchaseSchema, setPurchaseSchema] = useState(
    createPurchaseSchema(selectedTicket)
  )

  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      ticketType: event.tickets[0].id,
      quantity: 1
    }
  })

  function onSubmit(values: z.infer<typeof purchaseSchema>) {
    const ticket = event.tickets.find((t) => t.id === values.ticketType)
    if (!ticket) {
      toast({
        title: "Error",
        description: "Invalid ticket type selected.",
        variant: "destructive"
      })
      return
    }

    // Here you would typically send this data to your backend
    console.log("Purchase submitted:", { ...values, ticketName: ticket.name })
    toast({
      title: "Purchase Successful",
      description: `You have purchased ${values.quantity} ${ticket.name} ticket(s).`
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex items-center text-gray-500 mb-2">
            <CalendarDays className="mr-2 h-5 w-5" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-500 mb-2">
            <Clock className="mr-2 h-5 w-5" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin className="mr-2 h-5 w-5" />
            <span>{event.location}</span>
          </div>
          <Separator className="my-6" />
          <h2 className="text-2xl font-semibold mb-4">Event Theme</h2>
          <p className="text-gray-600 mb-6">{event.theme}</p>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Purchase Tickets</CardTitle>
              <CardDescription>
                Select your ticket type and quantity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                              event.tickets.find((t) => t.id === value) ||
                              event.tickets[0]
                            setSelectedTicket(newSelectedTicket)
                            setPurchaseSchema(
                              createPurchaseSchema(newSelectedTicket)
                            )
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
                            {event.tickets.map((ticket) => (
                              <SelectItem key={ticket.id} value={ticket.id}>
                                {ticket.name} - ${ticket.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the type of ticket you want to purchase.
                        </FormDescription>
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
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the number of tickets you want to purchase (max
                          10).
                        </FormDescription>
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
                            <Input
                              type={input.type}
                              placeholder={input.placeholder}
                              {...field}
                            />
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
            <CardFooter>
              <p className="text-sm text-gray-500">
                By purchasing tickets, you agree to our terms and conditions.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
