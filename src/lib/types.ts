export type DynamicInputType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "time"
  | "datetime-local"
  | "number"
  | "range"
  | "color"
  | "file"
  | "url"
  | "search"
  | "tel"

export type DynamicInput = {
  name: string
  label: string
  type: DynamicInputType
  placeholder?: string
  options?: Array<{
    label: string
    value: string
  }>
  required?: boolean
}
