import DynForm from "./components/dyn-form"

const dummyInputs = [
  {
    name: "name",
    label: "Name",
    type: "text"
  },
  {
    name: "email",
    label: "Email",
    type: "email"
  },
  {
    name: "message",
    label: "Message",
    type: "textarea"
  },
  {
    name: "terms",
    label: "I agree to the terms and conditions",
    type: "checkbox"
  },
  {
    name: "date",
    label: "Date of Birth",
    type: "date"
  },
  {
    name: "time",
    label: "Time of Birth",
    type: "time"
  },
  {
    name: "datetime-local",
    label: "Date and Time of Birth",
    type: "datetime-local"
  },
  {
    name: "number",
    label: "Number Input",
    type: "number"
  },
  {
    name: "range",
    label: "Range Input",
    type: "range"
  },
  {
    name: "color",
    label: "Color Input",
    type: "color"
  },
  {
    name: "file",
    label: "File Input",
    type: "file"
  },
  {
    name: "url",
    label: "URL Input",
    type: "url"
  },
  {
    name: "search",
    label: "Search Input",
    type: "search"
  },
  {
    name: "tel",
    label: "Telephone Input",
    type: "tel"
  },
  {
    name: "password",
    label: "Password Input",
    type: "password"
  },
  {
    name: "hidden",
    label: "Hidden Input",
    type: "hidden"
  },
  {
    name: "select",
    label: "Select Input",
    type: "select",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" }
    ]
  }
]

type RsvpPageProps = {
  searchParams: {
    eventId: string
  }
}

export default function RsvpPage({ searchParams: { eventId } }: RsvpPageProps) {
  return (
    <div className="py-8">
      <h1 className="mb-14 text-2xl">Event Name</h1>
      <DynForm inputs={dummyInputs as Array<any>} />
    </div>
  )
}
