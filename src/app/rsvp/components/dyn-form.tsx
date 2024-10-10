"use client"
import apiClient from "@/lib/api-client"
import { DynamicInput } from "@/lib/types"
import { useMutation } from "@tanstack/react-query"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"

type DynFormProps = {
  inputs: Array<DynamicInput>
  eventId: string
}

const rsvpFormSchema = z.object({
  ticketCount: z.number().min(1),
  attendees: z.array(z.any()).nonempty("Please add at least one attendee")
})

type RsvpFormSchema = z.infer<typeof rsvpFormSchema>

export default function DynForm({ inputs, eventId }: DynFormProps) {
  const form = useForm<RsvpFormSchema>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      ticketCount: 1,
      attendees: [{}]
    }
  })

  console.log("@form", form.formState.errors)

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "attendees"
  })

  const rsvpMutation = useMutation({
    mutationFn: apiClient.submitRsvp,
    onSuccess: () => {
      toast("Thanks for your RSVP!")
    },
    onError: (err) => {
      toast(err.message)
    }
  })

  const onSubmit = async (data: FieldValues) => {
    const payload = {
      attendees: data.attendees,
      eventId
    }

    console.log("@payload", payload)

    // rsvpMutation.mutate(payload)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="col-span-6">
        <label
          htmlFor="ticketCount"
          className="block text-sm font-medium text-gray-700"
        >
          Ticket Amount
        </label>
        <input
          {...form.register("ticketCount")}
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
        />
      </div>
      <hr className="border-gray-300" />
      <div className="flex items-center">
        <button
          type="button"
          disabled={fields.length === Number(form.getValues("ticketCount"))}
          onClick={() => prepend({})}
          className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring disabled:opacity-50"
        >
          Add Another
        </button>
        <button
          type="submit"
          className="focus:ring-primary-500 hover:bg-primary-700 ml-2 inline-flex w-full items-center justify-center rounded-md border bg-transparent px-4 py-2 text-sm font-medium text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
        >
          Continue &rarr;
        </button>
      </div>
      <h2
        className={cn(
          fields.length > form.watch("ticketCount") && "text-red-500"
        )}
      >
        {fields.length} of {form.watch("ticketCount") || 0} Ticket
      </h2>
      {fields.map((field, index) => (
        <div key={field.id} className="col-span-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {inputs.map((input) => (
              <div key={input.name} className="col-span-6">
                {input.type === "textarea" ? (
                  <>
                    <label
                      htmlFor={`attendees.${index}.${input.name}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {input.label}
                    </label>
                    <textarea
                      id={field.id}
                      required={input.required}
                      {...form.register(`attendees.${index}.${input.name}`)}
                      placeholder={input.placeholder}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
                    />
                  </>
                ) : input.type === "select" ? (
                  <>
                    <label
                      htmlFor={`attendees.${index}.${input.name}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {input.label}
                    </label>
                    <select
                      id={field.id}
                      required={input.required}
                      {...form.register(`attendees.${index}.${input.name}`)}
                      className="mt py-1.5-1 block w-full rounded-md border border-gray-300 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
                    >
                      {input.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </>
                ) : input.type === "checkbox" ? (
                  <div className="flex items-center">
                    <input
                      id={field.id}
                      required={input.required}
                      {...form.register(`attendees.${index}.${input.name}`)}
                      placeholder={input.placeholder}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`attendees.${index}.${input.name}`}
                      className="ml-2 block text-sm"
                    >
                      {input.label}
                    </label>
                  </div>
                ) : input.type === "date" ||
                  input.type === "time" ||
                  input.type === "datetime-local" ||
                  input.type === "number" ||
                  input.type === "range" ||
                  input.type === "color" ||
                  input.type === "file" ||
                  input.type === "url" ||
                  input.type === "search" ||
                  input.type === "tel" ||
                  input.type === "text" ||
                  input.type === "email" ||
                  input.type === "password" ? (
                  <>
                    <label
                      htmlFor={`attendees.${index}.${input.name}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {input.label}
                    </label>
                    <input
                      id={field.id}
                      required={input.required}
                      {...form.register(`attendees.${index}.${input.name}`)}
                      type={input.type}
                      placeholder={input.placeholder}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => remove(index)}
              className="focus:ring-indigosm inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </form>
  )
}
