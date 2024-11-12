import Client from "./base-api-client"

export const createApiClient = (token?: string) => {
  return new Client(process.env.NEXT_PUBLIC_APP_ENV || "development", {
    auth: token,
    requestInit: {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  })
}
