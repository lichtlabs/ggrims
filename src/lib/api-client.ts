import BaseApiService from "./base-api"
import type {
  BuyTicketResponse,
  Event,
  EventWithTicketInputs
} from "@/lib/types"

class ApiClient {
  async buyTicket(payload: {
    data: {
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
}

const apiClient = new ApiClient()

export default apiClient
