type DynFormProps = {
  inputs: Array<{
    name: string
    label: string
    type:
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
    options?: Array<{
      label: string
      value: string
    }>
  }>
}

export default function DynForm({ inputs }: DynFormProps) {
  return (
    <form>
      <div className="grid grid-cols-1 gap-6">
        {inputs.map((input) => (
          <div key={input.name} className="col-span-6">
            {input.type === "textarea" ? (
              <>
                <label
                  htmlFor={input.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {input.label}
                </label>
                <textarea
                  name={input.name}
                  id={input.name}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
                />
              </>
            ) : input.type === "select" ? (
              <>
                <label
                  htmlFor={input.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {input.label}
                </label>
                <select
                  name={input.name}
                  id={input.name}
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
                  id={input.name}
                  name={input.name}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={input.name} className="ml-2 block text-sm">
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
                  htmlFor={input.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {input.label}
                </label>
                <input
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
                />
              </>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  )
}
