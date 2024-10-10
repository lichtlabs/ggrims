"use client"
import { DynamicInput } from "@/lib/types"
import DynForm from "../components/dyn-form"

const dummyInputs: Array<DynamicInput> = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
    required: true
  },
  {
    name: "idLine",
    label: "ID Line",
    type: "text",
    placeholder: "Enter ID line",
    required: true
  }
]

type RsvpPageProps = {
  params: {
    eventId: string
  }
}

export default function RsvpPage({ params }: RsvpPageProps) {
  return (
    <div className="py-8">
      <h1 className="mb-14 text-2xl">Event Name</h1>
      <DynForm eventId={params.eventId} inputs={dummyInputs} />
    </div>
  )
}
