"use client"
import apiClient from "@/lib/api-client"
import { createTicketSchema } from "@/lib/schema"
import { CreateTicketSchema } from "@/lib/types"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function CreateTickets() {
  const { getToken } = useAuth()
  const form = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema)
  })

  const { data } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await apiClient.getUpcomingEvents()
      if (!res?.data) {
        return []
      }
      const options = res?.data?.map((event) => ({
        label: event.name,
        value: event.id
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

      const payload = {
        ...data,
        token
      }

      return await apiClient.createTicket(payload)
    },
    onSuccess: (data) => {
      toast(`${data?.data?.created || 0} tickets created`)
    },
    onError: (err) => {
      toast(err.message)
    }
  })

  const onSubmit = async (data: CreateTicketSchema) => {
    const token = await getToken()
    if (!token) {
      toast("Please login to create an event")
      return
    }

    const payload = {
      ...data,
      token
    }

    createTicketMutation.mutate(payload)
  }

  console.log("fw", form.watch())

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
