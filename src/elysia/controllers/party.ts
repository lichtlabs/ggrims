import Elysia, { t } from "elysia"

export const partyController = new Elysia({ prefix: "/party" }).get(
  "/",
  () => "Hello From Elysia 🦊"
)
