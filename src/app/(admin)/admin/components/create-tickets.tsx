"use client"
import { createApiClient } from "@/lib/api-client"
import { createTicketSchema } from "@/lib/schema"
import { CreateTicketSchema } from "@/lib/types"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { sendGTMEvent } from "@next/third-parties/google"

export default function CreateTickets() {
  const { getToken } = useAuth()
  const router = useRouter()
  const form = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema)
  })

  const { data } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await createApiClient().events.ListUpcomingEvents()
      if (!res?.data) {
        return []
      }
      const options = res?.data?.map((event) => ({
        label: event.name,
        value: event.id as unknown as string
      }))

      return options as Array<{ label: string; value: string }>
    },
    refetchOnWindowFocus: false
  })

  const createTicketMutation = useMutation({
    mutationFn: async (data: CreateTicketSchema) => {
      const token = await getToken()
      if (!token) {
        toast("Please login to create an event")
        return
      }

      return await createApiClient(token).events.CreateTickets(
        form.getValues("eventId") || "",
        {
          name: data.name,
          description: data.description,
          price: data.price,
          benefits: JSON.parse(data.benefits),
          ticket_count: parseInt(data.ticket_count),
          min: parseInt(data.min),
          max: parseInt(data.max)
        }
      )
    },
    onSuccess: (data) => {
      toast(`${data?.data?.created || 0} tickets created`)
      setTimeout(() => router.push("/upcoming"), 200)
    },
    onError: (err) => {
      toast(err.message)
    }
  })

  const onSubmit = async (data: CreateTicketSchema) => {
    createTicketMutation.mutate(data)

    sendGTMEvent({
      event: 'create_ticket',
      event_id: data.eventId,
      ticket_name: data.name,
      ticket_price: data.price,
      ticket_quantity: data.ticket_count
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Select Event */}
      <div className="col-span-6" style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="event"
          className="block text-sm font-medium text-gray-700"
        >
          Event
        </label>
        <select
          {...form.register("eventId")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        >
          {data?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          {...form.register("name")}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          {...form.register("description")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          {...form.register("price")}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="benefits"
          className="block text-sm font-medium text-gray-700"
        >
          Benefits
        </label>
        <textarea
          {...form.register("benefits")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="min"
          className="block text-sm font-medium text-gray-700"
        >
          Min People
        </label>
        <input
          {...form.register("min")}
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="max"
          className="block text-sm font-medium text-gray-700"
        >
          Max People
        </label>
        <input
          {...form.register("max")}
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="ticket_count"
          className="block text-sm font-medium text-gray-700"
        >
          Ticket Count
        </label>
        <input
          {...form.register("ticket_count")}
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <button
          type="submit"
          className="focus:ring-primary-500 hover:bg-primary-700 ml-2 inline-flex w-full items-center justify-center rounded-md border bg-transparent px-4 py-2 text-sm font-medium text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  )
}
