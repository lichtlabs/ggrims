"use client"
import { createEventSchema } from "@/lib/schema"
import { CreateEventSchema } from "@/lib/types"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { createApiClient } from "@/lib/api-client"
import { eventsv1 } from "@/lib/base-api-client"

export default function CreateEvent() {
  const { getToken } = useAuth()
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema)
  })

  const createEventMutation = useMutation({
    mutationFn: async (
      data: CreateEventSchema
    ): Promise<eventsv1.BaseResponse<eventsv1.InsertionResponse>> => {
      const token = await getToken()
      if (!token) {
        toast("Please login to create an event")
        return {data: {created: 0}, message: ""}
      }

      const res = await createApiClient().eventsv1.CreateEvent({
        name: data.name,
        description: data.description,
        location: data.location,
        // timestamptz format
        event_start_date: format(
          data.event_start_date,
          "yyyy-MM-dd'T'HH:mm:ssXXX"
        ),
        event_end_date: format(data.event_end_date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        inputs: JSON.parse(data.inputs)
      })
      return res
    },
    onSuccess: (data) => {
      toast(`${data.data.created || 0} events created`)
    },
    onError: (err) => {
      toast(err.message)
    }
  })

  const onSubmit = async (data: CreateEventSchema) => {
    createEventMutation.mutate({
      name: data.name,
      description: data.description,
      location: data.location,
      event_start_date: data.event_start_date,
      event_end_date: data.event_end_date,
      inputs: data.inputs
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          {...form.register("location")}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="event_start_date"
          className="block text-sm font-medium text-gray-700"
        >
          Event Start Date
        </label>
        <input
          {...form.register("event_start_date")}
          type="datetime-local"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="event_end_date"
          className="block text-sm font-medium text-gray-700"
        >
          Event End Date
        </label>
        <input
          {...form.register("event_end_date")}
          type="datetime-local"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <div className="col-span-6">
        <label
          htmlFor="inputs"
          className="block text-sm font-medium text-gray-700"
        >
          Inputs
        </label>
        <textarea
          {...form.register("inputs")}
          rows={10}
          placeholder="JSON array of inputs"
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
