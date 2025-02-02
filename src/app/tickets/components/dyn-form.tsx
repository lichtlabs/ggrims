/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { createApiClient } from "@/lib/api-client"
import { Ticket } from "@/lib/types"
import { useMutation } from "@tanstack/react-query"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { AsteriskIcon, Loader2 } from "lucide-react"
import { events } from "@/lib/base-api-client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { sendGTMEvent } from "@next/third-parties/google"

type DynFormProps = {
  inputs: events.EventTicketInput[]
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    link: ""
  })

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
    mutationFn: (data: { eventId: string; data: events.BuyTicketRequest }) =>
      createApiClient().events.BuyTickets(data.eventId, data.data),
    onSuccess: (data: any) => {
      setDialogContent({
        title: "Purchase Successful",
        description:
          "Thanks for your purchase! Your ticket will be sent to your email soon.",
        link: data?.data.link_url ? `https://${data.data.link_url}` : ""
      })
      setIsDialogOpen(true)
      sendGTMEvent({
        event: 'purchase_ticket',
        event_id: eventId,
        ticket_name: ticket?.name,
        ticket_price: ticket?.price,
        ticket_quantity: data.ticketCount,
        total_amount: Number(ticket?.price) * Number(data.ticketCount)
      })

      form.reset()
    },
    onError: (err) => {
      setDialogContent({
        title: "Purchase Failed",
        description: err.message,
        link: ""
      })
      setIsDialogOpen(true)
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
    } as {
      data: events.BuyTicketRequest
      eventId: string
    }

    getTicketMutation.mutate(payload)
  }

  const totalPrice =
    parseInt(form.watch("ticketCount")) * serviceFee +
    parseInt(ticket?.price || "0") * parseInt(form.watch("ticketCount"))

  const minAttendance = ticket?.min || 1
  const maxAttendance = ticket?.max || 1
  const ticketCount = parseInt(form.watch("ticketCount")) || 0
  const minAttendanceTotal = minAttendance * ticketCount
  const maxAttendanceTotal = maxAttendance * ticketCount
  const dataOverflow = fields.length > maxAttendanceTotal
  const dataUnderflow = fields.length < minAttendanceTotal

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="col-span-6">
          <label
            htmlFor="ticketCount"
            className="block text-sm font-medium text-gray-700"
          >
            Ticket Amount
          </label>
          <input
            data-testid="ticket_amount"
            {...form.register("ticketCount")}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (isNaN(value) || value < 1) {
                form.setValue("ticketCount", "")
              } else if (
                ticket &&
                ticket.count !== undefined &&
                value > ticket.count
              ) {
                form.setValue("ticketCount", ticket.count.toString())
              } else {
                form.setValue("ticketCount", value.toString())
              }
            }}
            type="number"
            min="1"
            max={ticket?.count}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
          />
        </div>
        <hr className="border-gray-300" />
        <div className="flex items-center">
          <button
            name="Add Another"
            type="button"
            disabled={
              fields.length >= maxAttendanceTotal || getTicketMutation.isPending
            }
            onClick={() => prepend({})}
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring disabled:opacity-50"
          >
            Add Another
          </button>
          <button
            disabled={getTicketMutation.isPending || dataUnderflow}
            type="submit"
            className="focus:ring-primary-500 hover:bg-primary-700 ml-2 inline-flex w-full items-center justify-center rounded-md border bg-transparent px-4 py-2 text-sm font-medium text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            data-testid="submit-button"
          >
            Continue {!getTicketMutation.isPending && <>&rarr; </>}
            {getTicketMutation.isPending && (
              <Loader2 className="ml-3 h-3 w-3 animate-spin" />
            )}
          </button>
        </div>
        <h2 className={cn(dataOverflow && "text-red-500", dataUnderflow && "text-yellow-500")}>
          Fill {minAttendanceTotal}-{maxAttendanceTotal} data for {ticketCount} Ticket
          {ticketCount > 1 ? "s" : ""} + Service Fee = IDR{" "}
          {Number.isNaN(totalPrice) ? 0 : totalPrice.toLocaleString()}
        </h2>
        {fields.map((field, index) => (
          <div key={field.id} className="col-span-6 space-y-6">
            <h3 className="font-medium">Attendee #{fields.length - index}</h3>
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
                        data-testid={`attendees.${index}.${input.name}`}
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
                        data-testid={`attendees.${index}.${input.name}`}
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
                        data-testid={`attendees.${index}.${input.name}`}
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
                        data-testid={`attendees.${index}.${input.name}`}
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
                        data-testid={`attendees.${index}.${input.name}`}
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
                disabled={
                  getTicketMutation.isPending ||
                  fields.length <= minAttendanceTotal
                }
                onClick={() => remove(index)}
                className="focus:ring-indigosm inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} data-testid="success-dialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          {dialogContent.link && (
            <Button
              onClick={() => window.open(dialogContent.link, "_blank")}
              className="mt-4"
            >
              Go to Payment Page
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
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
