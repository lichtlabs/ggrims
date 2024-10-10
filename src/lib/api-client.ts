import BaseApiService from "./base-api"

class ApiClient {
  async submitRsvp(payload: {
    data: Array<Record<string, FormDataEntryValue>>
    eventId: string
  }) {
    console.log(payload)
    // return BaseApiService.post({
    //   endpoint: `/events/${payload.eventId}/rsvp`,
    //   data: payload
    // })
  }
}

const apiClient = new ApiClient()

export default apiClient
