import BaseApiService from "./base-api"
import type {
  BuyTicketResponse,
  CreateEventSchema,
  Event,
  EventWithTicketInputs,
  Ticket
} from "@/lib/types"

class ApiClient {
  async listTickets(eventId: string) {
    return BaseApiService.get<
      Array<
        Omit<
          Ticket & {
            count: number
          },
          "id"
        >
      >
    >({
      endpoint: `/events/${eventId}/tickets`
    })
  }

  async buyTicket(payload: {
    data: {
      ticket_name: string
      ticket_amount: number
      attendees: Array<Record<string, FormDataEntryValue>>
    }
    eventId: string
  }) {
    return BaseApiService.post<BuyTicketResponse>({
      endpoint: `/events/${payload.eventId}/tickets/buy`,
      data: payload.data
    })
  }

  async getUpcomingEvents() {
    return BaseApiService.get<Array<Event>>({
      endpoint: "upcoming-events"
    })
  }

  async getEvent(id: string) {
    return BaseApiService.get<EventWithTicketInputs>({
      endpoint: `/events/${id}`
    })
  }

  async createEvent(payload: CreateEventSchema & { token?: string }) {
    payload.inputs = JSON.parse(payload.inputs)
    if (!payload.token) {
      throw new Error("Token is required")
    }
    const base = BaseApiService.withCredentials(payload.token)
    delete payload.token
    return base.post<{
      created: number
    }>({
      endpoint: "/events",
      data: payload
    })
  }
}

const apiClient = new ApiClient()

export default apiClient
