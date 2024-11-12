import { elysia } from "@/elysia/client"

export default async function Home() {
  const { data, error } = await elysia.api.message.index.get()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <p className="text-4xl font-bold text-black/80">{data}</p>
    </main>
  )
}
