"use client"
import apiClient from "@/lib/api-client"
import { DynamicInput, Ticket } from "@/lib/types"
import { useMutation } from "@tanstack/react-query"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { AsteriskIcon } from "lucide-react"
import { setTimeout } from "timers"

type DynFormProps = {
  inputs: Array<DynamicInput>
  eventId: string
  ticket?: Omit<Ticket, "id"> & { count: number }
}

const getTicketFormSchema = z.object({
  ticketCount: z.string().min(1),
  attendees: z.array(z.any()).nonempty("Please add at least one attendee")
})

type GetTicketFormSchema = z.infer<typeof getTicketFormSchema>

export default function DynForm({ inputs, eventId, ticket }: DynFormProps) {
  const serviceFee = 1000 // 1000 Rupiah

  const form = useForm<GetTicketFormSchema>({
    resolver: zodResolver(getTicketFormSchema),
    defaultValues: {
      ticketCount: "1",
      attendees: [{}]
    }
  })

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "attendees"
  })

  const getTicketMutation = useMutation({
    mutationFn: apiClient.buyTicket,
    onSuccess: (data: any) => {
      toast(
        "Thanks for your purchases! Your ticket will be sent to your email soon.",
        {
          duration: 120000
        }
      )
      setTimeout(() => {
        // redirect to data?.data.link_url
        if (!data) {
          return
        }
        const redirectUrl = "https://" + data?.data.link_url
        window.open(redirectUrl, "_blank")
      }, 1000)
    },
    onError: (err) => {
      toast(err.message)
    }
  })

  const onSubmit = async (data: FieldValues) => {
    const payload = {
      data: {
        ticket_name: ticket?.name,
        attendees: data.attendees,
        ticket_amount: parseInt(data.ticketCount)
      },
      eventId
    }
    getTicketMutation.mutate(payload)
  }

  console.log("@input state errors:", form.formState.errors)

  const totalPrice =
    parseInt(form.watch("ticketCount")) * serviceFee +
    parseInt(ticket?.price || "0") * parseInt(form.watch("ticketCount"))

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="col-span-6">
        <label
          htmlFor="ticketCount"
          className="block text-sm font-medium text-gray-700"
        >
          Ticket Amount{" "}
        </label>
        <input
          {...form.register("ticketCount")}
          // validation with tocket count
          onChange={(e) => {
            form.setValue(
              "ticketCount",
              parseInt(e.target.value) > ((ticket as any) && ticket?.count)
                ? ""
                : e.target.value
            )
          }}
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
          fields.length > parseInt(form.watch("ticketCount")) && "text-red-500"
        )}
      >
        {fields.length} of {form.watch("ticketCount") || 0} Ticket + Service Fee
        ={" IDR "}
        {Number.isNaN(totalPrice) ? 0 : totalPrice.toLocaleString()}
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
                      <div className="flex">
                        {input.label} {input.required && <Required />}
                      </div>
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
                      <div className="flex">
                        {input.label} {input.required && <Required />}
                      </div>
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
                      <div className="flex">
                        {input.label} {input.required && <Required />}
                      </div>
                    </label>
                  </div>
                ) : input.type === "number" ? (
                  <>
                    {" "}
                    <label
                      htmlFor={`attendees.${index}.${input.name}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      <div className="flex">
                        {input.label} {input.required && <Required />}
                      </div>
                    </label>
                    <input
                      id={field.id}
                      required={input.required}
                      {...form.register(`attendees.${index}.${input.name}`)}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={(e) => {
                        form.setValue(
                          `attendees.${index}.${input.name}`,
                          parseInt(e.target.value)
                        )
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
                    />
                  </>
                ) : input.type === "date" ||
                  input.type === "time" ||
                  input.type === "datetime-local" ||
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
                      <div className="flex">
                        {input.label} {input.required && <Required />}
                      </div>
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

function Required() {
  return (
    <span className="inline text-red-500">
      <span className="sr-only">Required</span>
      <AsteriskIcon className="h-3 w-3" />
    </span>
  )
}
