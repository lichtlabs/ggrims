// Code generated by the Encore v1.43.2 client generator. DO NOT EDIT.

// Disable eslint, jshint, and jslint for this file.
/* eslint-disable */
/* jshint ignore:start */
/*jslint-disable*/

/**
 * BaseURL is the base URL for calling the Encore application's API.
 */
export type BaseURL = string

export const Local: BaseURL = "http://localhost:4000"

/**
 * Environment returns a BaseURL for calling the cloud environment with the given name.
 */
export function Environment(name: string): BaseURL {
  if (name == "prod" || name == "v1") return `https://api.ggrims.lichtlabs.org`
  return `https://${name}-ggrims-services-n2gi.encr.app`
}

/**
 * PreviewEnv returns a BaseURL for calling the preview environment with the given PR number.
 */
export function PreviewEnv(pr: number | string): BaseURL {
  return Environment(`pr${pr}`)
}

/**
 * Client is an API client for the ggrims-services-n2gi Encore application.
 */
export default class Client {
  public readonly events: events.ServiceClient

  /**
   * @deprecated This constructor is deprecated, and you should move to using BaseURL with an Options object
   */
  constructor(target: string, token?: string)

  /**
   * Creates a Client for calling the public and authenticated APIs of your Encore application.
   *
   * @param target  The target which the client should be configured to use. See Local and Environment for options.
   * @param options Options for the client
   */
  constructor(target: BaseURL, options?: ClientOptions)
  constructor(
    target: string | BaseURL = "prod",
    options?: string | ClientOptions
  ) {
    // Convert the old constructor parameters to a BaseURL object and a ClientOptions object
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = Environment(target)
    }

    if (typeof options === "string") {
      options = { auth: options }
    }

    const base = new BaseClient(target, options ?? {})
    this.events = new events.ServiceClient(base)
  }
}

/**
 * ClientOptions allows you to override any default behaviour within the generated Encore client.
 */
export interface ClientOptions {
  /**
   * By default the client will use the inbuilt fetch function for making the API requests.
   * however you can override it with your own implementation here if you want to run custom
   * code on each API request made or response received.
   */
  fetcher?: Fetcher

  /** Default RequestInit to be used for the client */
  requestInit?: Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>
  }

  /**
   * Allows you to set the auth token to be used for each request
   * either by passing in a static token string or by passing in a function
   * which returns the auth token.
   *
   * These tokens will be sent as bearer tokens in the Authorization header.
   */
  auth?: string | AuthDataGenerator
}

export namespace events {
  export interface BaseResponse<T> {
    data: T
    message: string
  }

  /**
   * BuyTicketRequest represents the payload required to purchase tickets for an event.
   */
  export interface BuyTicketRequest {
    ticket_name: string
    ticket_amount: number
    attendees: { [key: string]: string }[]
  }

  /**
   * BuyTicketResponse combines the data of a ticket purchase and the billing response.
   */
  export interface BuyTicketResponse {}

  export interface CreateEventRequest {
    name: string
    description: string
    location: string
    event_start_date: string
    event_end_date: string
    inputs: EventTicketInput[]
  }

  /**
   * CreateTicketRequest represents a request to create a new ticket for an event. It includes the ticket's name,
   * description, price, associated benefits, and the total number of tickets to create.
   */
  export interface CreateTicketRequest {
    name: string
    description: string
    price: string
    benefits: string[]
    ticket_count: number
    min: number
    max: number
  }

  /**
   * DeleteTicketRequest represents a request to delete a specified number of tickets by name.
   */
  export interface DeleteTicketRequest {
    ticket_name: string
    ticket_count: number
  }

  export interface DeletesResponse {
    deleted: number
  }

  export interface Event {
    id: pgtype.UUID
    name: string
    description: string
    location: string
    event_start_date: pgtype.Timestamptz
    event_end_date: pgtype.Timestamptz
    created_at: pgtype.Timestamptz
    updated_at: pgtype.Timestamptz
    inputs: EventTicketInput[]
  }

  export interface EventTicketInput {
    name: string
    label: string
    type: string
    placeholder: string
    required: boolean
    options: {
      label: string
      value: string
    }[]
  }

  export interface InsertionResponse {
    created: number
  }

  export interface ListDistinctTicketsResponse {
    event_id: pgtype.UUID
    name: string
    description: string
    price: string
    benefits: string[]
    status: db.TicketStatus
    min: number
    max: number
    created_at: pgtype.Timestamptz
    updated_at: pgtype.Timestamptz
    count: number
  }

  export interface ListQuery {
    Page: number
    Limit: number
    OrderBy: string
  }

  /**
   * UpdateTicketRequest represents a request structure for updating ticket information.
   */
  export interface UpdateTicketRequest {
    name: string
    description: string
    price: string
    benefits: string[]
    ticket_count: number
  }

  export interface UpdatesResponse {
    updated: number
  }

  export class ServiceClient {
    private baseClient: BaseClient

    constructor(baseClient: BaseClient) {
      this.baseClient = baseClient
    }

    /**
     * BuyTickets processes the ticket purchase request, handles the database transaction, and manages billing for the tickets.
     */
    public async BuyTickets(
      id: string,
      params: BuyTicketRequest
    ): Promise<BaseResponse<BuyTicketResponse>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "POST",
        `/v1/events/${encodeURIComponent(id)}/tickets/buy`,
        JSON.stringify(params)
      )
      return (await resp.json()) as BaseResponse<BuyTicketResponse>
    }

    /**
     * Callback handles the HTTP request for processing a payment callback, updating the database, and changing ticket statuses.
     */
    public async Callback(
      method: "POST",
      body?: BodyInit,
      options?: CallParameters
    ): Promise<Response> {
      return this.baseClient.callAPI(
        method,
        `/payments/callback`,
        body,
        options
      )
    }

    /**
     * CreateEvent Create an event
     */
    public async CreateEvent(
      params: CreateEventRequest
    ): Promise<BaseResponse<InsertionResponse>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "POST",
        `/v1/events`,
        JSON.stringify(params)
      )
      return (await resp.json()) as BaseResponse<InsertionResponse>
    }

    /**
     * CreateTickets creates multiple tickets for an event and inserts them into the database within a transaction.
     * It takes a context, event ID (UUID), and a CreateTicketRequest object as input.
     * Returns a BaseResponse containing the count of created tickets and a success message, or an error if operation fails.
     */
    public async CreateTickets(
      id: string,
      params: CreateTicketRequest
    ): Promise<BaseResponse<InsertionResponse>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "POST",
        `/v1/events/${encodeURIComponent(id)}/tickets/create`,
        JSON.stringify(params)
      )
      return (await resp.json()) as BaseResponse<InsertionResponse>
    }

    /**
     * DeleteEvent Delete an event
     */
    public async DeleteEvent(id: string): Promise<void> {
      await this.baseClient.callAPI(
        "DELETE",
        `/v1/events/${encodeURIComponent(id)}`
      )
    }

    /**
     * DeleteTickets removes a specified number of tickets based on the given `DeleteTicketRequest`.
     * It returns a `BaseResponse` containing `DeletesResponse` with the number of deleted tickets or an error.
     */
    public async DeleteTickets(
      id: string,
      params: DeleteTicketRequest
    ): Promise<BaseResponse<DeletesResponse>> {
      // Convert our params into the objects we need for the request
      const query = makeRecord<string, string | string[]>({
        ticket_count: String(params["ticket_count"]),
        ticket_name: params["ticket_name"]
      })

      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "DELETE",
        `/v1/events/${encodeURIComponent(id)}/tickets/delete`,
        undefined,
        { query }
      )
      return (await resp.json()) as BaseResponse<DeletesResponse>
    }

    /**
     * GetEvent Get an event including ticket inputs
     */
    public async GetEvent(id: string): Promise<BaseResponse<Event>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "GET",
        `/v1/events/${encodeURIComponent(id)}`
      )
      return (await resp.json()) as BaseResponse<Event>
    }

    /**
     * ListDistinctTickets retrieves a list of distinct tickets based on a given event ID.
     * It returns a BaseResponse containing a list of ListDistinctTicketsResponse or an error if the operation fails.
     */
    public async ListDistinctTickets(
      id: string
    ): Promise<BaseResponse<ListDistinctTicketsResponse[]>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "GET",
        `/v1/events/${encodeURIComponent(id)}/tickets/distinct`
      )
      return (await resp.json()) as BaseResponse<ListDistinctTicketsResponse[]>
    }

    /**
     * ListEventAttendees List attendees on an event
     */
    public async ListEventAttendees(
      id: string,
      params: ListQuery
    ): Promise<BaseResponse<db.ListAttendeeRow[]>> {
      // Convert our params into the objects we need for the request
      const query = makeRecord<string, string | string[]>({
        limit: String(params.Limit),
        order_by: params.OrderBy,
        page: String(params.Page)
      })

      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "GET",
        `/v1/events/${encodeURIComponent(id)}/attendees`,
        undefined,
        { query }
      )
      return (await resp.json()) as BaseResponse<db.ListAttendeeRow[]>
    }

    /**
     * ListEvents Get all events including ticket inputs
     */
    public async ListEvents(params: ListQuery): Promise<BaseResponse<Event[]>> {
      // Convert our params into the objects we need for the request
      const query = makeRecord<string, string | string[]>({
        limit: String(params.Limit),
        order_by: params.OrderBy,
        page: String(params.Page)
      })

      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "GET",
        `/v1/events`,
        undefined,
        { query }
      )
      return (await resp.json()) as BaseResponse<Event[]>
    }

    /**
     * ListUpcomingEvents Get all upcoming events including ticket inputs
     */
    public async ListUpcomingEvents(): Promise<BaseResponse<Event[]>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI("GET", `/v1/upcoming-events`)
      return (await resp.json()) as BaseResponse<Event[]>
    }

    /**
     * UpdateEvent Update an event
     */
    public async UpdateEvent(
      id: string,
      params: db.UpdateEventParams
    ): Promise<void> {
      await this.baseClient.callAPI(
        "PUT",
        `/v1/events/${encodeURIComponent(id)}`,
        JSON.stringify(params)
      )
    }

    /**
     * UpdateTickets updates a specified number of tickets in the database within a single transaction.
     */
    public async UpdateTickets(
      id: string,
      params: UpdateTicketRequest
    ): Promise<BaseResponse<UpdatesResponse>> {
      // Now make the actual call to the API
      const resp = await this.baseClient.callAPI(
        "PUT",
        `/v1/events/${encodeURIComponent(id)}/tickets/update`,
        JSON.stringify(params)
      )
      return (await resp.json()) as BaseResponse<UpdatesResponse>
    }
  }
}

export namespace db {
  export interface ListAttendeeRow {
    ID: pgtype.UUID
    EventID: pgtype.UUID
    TicketID: pgtype.UUID
    Data: string
    CreatedAt: pgtype.Timestamptz
    UpdatedAt: pgtype.Timestamptz
  }

  export type TicketStatus = string

  export interface UpdateEventParams {
    Name: string
    Description: string
    Location: string
    EventStartDate: pgtype.Timestamptz
    EventEndDate: pgtype.Timestamptz
    EventID: pgtype.UUID
  }
}

export namespace pgtype {
  export type InfinityModifier = number

  /**
   * Timestamptz represents the PostgreSQL timestamptz type.
   */
  export interface Timestamptz {
    Time: string
    InfinityModifier: InfinityModifier
    Valid: boolean
  }

  export interface UUID {
    Bytes: string
    Valid: boolean
  }
}

function encodeQuery(parts: Record<string, string | string[]>): string {
  const pairs: string[] = []
  for (const key in parts) {
    const val = (
      Array.isArray(parts[key]) ? parts[key] : [parts[key]]
    ) as string[]
    for (const v of val) {
      pairs.push(`${key}=${encodeURIComponent(v)}`)
    }
  }
  return pairs.join("&")
}

// makeRecord takes a record and strips any undefined values from it,
// and returns the same record with a narrower type.
// @ts-ignore - TS ignore because makeRecord is not always used
function makeRecord<K extends string | number | symbol, V>(
  record: Record<K, V | undefined>
): Record<K, V> {
  for (const key in record) {
    if (record[key] === undefined) {
      delete record[key]
    }
  }
  return record as Record<K, V>
}

function encodeWebSocketHeaders(headers: Record<string, string>) {
  // url safe, no pad
  const base64encoded = btoa(JSON.stringify(headers))
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
  return "encore.dev.headers." + base64encoded
}

class WebSocketConnection {
  public ws: WebSocket

  private hasUpdateHandlers: (() => void)[] = []

  constructor(url: string, headers?: Record<string, string>) {
    let protocols = ["encore-ws"]
    if (headers) {
      protocols.push(encodeWebSocketHeaders(headers))
    }

    this.ws = new WebSocket(url, protocols)

    this.on("error", () => {
      this.resolveHasUpdateHandlers()
    })

    this.on("close", () => {
      this.resolveHasUpdateHandlers()
    })
  }

  resolveHasUpdateHandlers() {
    const handlers = this.hasUpdateHandlers
    this.hasUpdateHandlers = []

    for (const handler of handlers) {
      handler()
    }
  }

  async hasUpdate() {
    // await until a new message have been received, or the socket is closed
    await new Promise((resolve) => {
      this.hasUpdateHandlers.push(() => resolve(null))
    })
  }

  on(
    type: "error" | "close" | "message" | "open",
    handler: (event: any) => void
  ) {
    this.ws.addEventListener(type, handler)
  }

  off(
    type: "error" | "close" | "message" | "open",
    handler: (event: any) => void
  ) {
    this.ws.removeEventListener(type, handler)
  }

  close() {
    this.ws.close()
  }
}

export class StreamInOut<Request, Response> {
  public socket: WebSocketConnection
  private buffer: Response[] = []

  constructor(url: string, headers?: Record<string, string>) {
    this.socket = new WebSocketConnection(url, headers)
    this.socket.on("message", (event: any) => {
      this.buffer.push(JSON.parse(event.data))
      this.socket.resolveHasUpdateHandlers()
    })
  }

  close() {
    this.socket.close()
  }

  async send(msg: Request) {
    if (this.socket.ws.readyState === WebSocket.CONNECTING) {
      // await that the socket is opened
      await new Promise((resolve) => {
        this.socket.ws.addEventListener("open", resolve, { once: true })
      })
    }

    return this.socket.ws.send(JSON.stringify(msg))
  }

  async next(): Promise<Response | undefined> {
    for await (const next of this) return next
    return undefined
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Response, undefined, void> {
    while (true) {
      if (this.buffer.length > 0) {
        yield this.buffer.shift() as Response
      } else {
        if (this.socket.ws.readyState === WebSocket.CLOSED) return
        await this.socket.hasUpdate()
      }
    }
  }
}

export class StreamIn<Response> {
  public socket: WebSocketConnection
  private buffer: Response[] = []

  constructor(url: string, headers?: Record<string, string>) {
    this.socket = new WebSocketConnection(url, headers)
    this.socket.on("message", (event: any) => {
      this.buffer.push(JSON.parse(event.data))
      this.socket.resolveHasUpdateHandlers()
    })
  }

  close() {
    this.socket.close()
  }

  async next(): Promise<Response | undefined> {
    for await (const next of this) return next
    return undefined
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Response, undefined, void> {
    while (true) {
      if (this.buffer.length > 0) {
        yield this.buffer.shift() as Response
      } else {
        if (this.socket.ws.readyState === WebSocket.CLOSED) return
        await this.socket.hasUpdate()
      }
    }
  }
}

export class StreamOut<Request, Response> {
  public socket: WebSocketConnection
  private responseValue: Promise<Response>

  constructor(url: string, headers?: Record<string, string>) {
    let responseResolver: (_: any) => void
    this.responseValue = new Promise((resolve) => (responseResolver = resolve))

    this.socket = new WebSocketConnection(url, headers)
    this.socket.on("message", (event: any) => {
      responseResolver(JSON.parse(event.data))
    })
  }

  async response(): Promise<Response> {
    return this.responseValue
  }

  close() {
    this.socket.close()
  }

  async send(msg: Request) {
    if (this.socket.ws.readyState === WebSocket.CONNECTING) {
      // await that the socket is opened
      await new Promise((resolve) => {
        this.socket.ws.addEventListener("open", resolve, { once: true })
      })
    }

    return this.socket.ws.send(JSON.stringify(msg))
  }
}
// CallParameters is the type of the parameters to a method call, but require headers to be a Record type
type CallParameters = Omit<RequestInit, "method" | "body" | "headers"> & {
  /** Headers to be sent with the request */
  headers?: Record<string, string>

  /** Query parameters to be sent with the request */
  query?: Record<string, string | string[]>
}

// AuthDataGenerator is a function that returns a new instance of the authentication data required by this API
export type AuthDataGenerator = () =>
  | string
  | Promise<string | undefined>
  | undefined

// A fetcher is the prototype for the inbuilt Fetch function
export type Fetcher = typeof fetch

const boundFetch = fetch.bind(this)

class BaseClient {
  readonly baseURL: string
  readonly fetcher: Fetcher
  readonly headers: Record<string, string>
  readonly requestInit: Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>
  }
  readonly authGenerator?: AuthDataGenerator

  constructor(baseURL: string, options: ClientOptions) {
    this.baseURL = baseURL
    this.headers = {
      "Content-Type": "application/json"
    }

    // Add User-Agent header if the script is running in the server
    // because browsers do not allow setting User-Agent headers to requests
    if (typeof window === "undefined") {
      this.headers["User-Agent"] =
        "ggrims-services-n2gi-Generated-TS-Client (Encore/v1.43.2)"
    }

    this.requestInit = options.requestInit ?? {}

    // Setup what fetch function we'll be using in the base client
    if (options.fetcher !== undefined) {
      this.fetcher = options.fetcher
    } else {
      this.fetcher = boundFetch
    }

    // Setup an authentication data generator using the auth data token option
    if (options.auth !== undefined) {
      const auth = options.auth
      if (typeof auth === "function") {
        this.authGenerator = auth
      } else {
        this.authGenerator = () => auth
      }
    }
  }

  async getAuthData(): Promise<CallParameters | undefined> {
    let authData: string | undefined

    // If authorization data generator is present, call it and add the returned data to the request
    if (this.authGenerator) {
      const mayBePromise = this.authGenerator()
      if (mayBePromise instanceof Promise) {
        authData = await mayBePromise
      } else {
        authData = mayBePromise
      }
    }

    if (authData) {
      const data: CallParameters = {}

      data.headers = {}
      data.headers["Authorization"] = "Bearer " + authData

      return data
    }

    return undefined
  }

  // createStreamInOut sets up a stream to a streaming API endpoint.
  async createStreamInOut<Request, Response>(
    path: string,
    params?: CallParameters
  ): Promise<StreamInOut<Request, Response>> {
    let { query, headers } = params ?? {}

    // Fetch auth data if there is any
    const authData = await this.getAuthData()

    // If we now have authentication data, add it to the request
    if (authData) {
      if (authData.query) {
        query = { ...query, ...authData.query }
      }
      if (authData.headers) {
        headers = { ...headers, ...authData.headers }
      }
    }

    const queryString = query ? "?" + encodeQuery(query) : ""
    return new StreamInOut(this.baseURL + path + queryString, headers)
  }

  // createStreamIn sets up a stream to a streaming API endpoint.
  async createStreamIn<Response>(
    path: string,
    params?: CallParameters
  ): Promise<StreamIn<Response>> {
    let { query, headers } = params ?? {}

    // Fetch auth data if there is any
    const authData = await this.getAuthData()

    // If we now have authentication data, add it to the request
    if (authData) {
      if (authData.query) {
        query = { ...query, ...authData.query }
      }
      if (authData.headers) {
        headers = { ...headers, ...authData.headers }
      }
    }

    const queryString = query ? "?" + encodeQuery(query) : ""
    return new StreamIn(this.baseURL + path + queryString, headers)
  }

  // createStreamOut sets up a stream to a streaming API endpoint.
  async createStreamOut<Request, Response>(
    path: string,
    params?: CallParameters
  ): Promise<StreamOut<Request, Response>> {
    let { query, headers } = params ?? {}

    // Fetch auth data if there is any
    const authData = await this.getAuthData()

    // If we now have authentication data, add it to the request
    if (authData) {
      if (authData.query) {
        query = { ...query, ...authData.query }
      }
      if (authData.headers) {
        headers = { ...headers, ...authData.headers }
      }
    }

    const queryString = query ? "?" + encodeQuery(query) : ""
    return new StreamOut(this.baseURL + path + queryString, headers)
  }

  // callAPI is used by each generated API method to actually make the request
  public async callAPI(
    method: string,
    path: string,
    body?: BodyInit,
    params?: CallParameters
  ): Promise<Response> {
    let { query, headers, ...rest } = params ?? {}
    const init = {
      ...this.requestInit,
      ...rest,
      method,
      body: body ?? null
    }

    // Merge our headers with any predefined headers
    init.headers = { ...this.headers, ...init.headers, ...headers }

    // Fetch auth data if there is any
    const authData = await this.getAuthData()

    // If we now have authentication data, add it to the request
    if (authData) {
      if (authData.query) {
        query = { ...query, ...authData.query }
      }
      if (authData.headers) {
        init.headers = { ...init.headers, ...authData.headers }
      }
    }

    // Make the actual request
    const queryString = query ? "?" + encodeQuery(query) : ""
    const response = await this.fetcher(this.baseURL + path + queryString, init)

    // handle any error responses
    if (!response.ok) {
      // try and get the error message from the response body
      let body: APIErrorResponse = {
        code: ErrCode.Unknown,
        message: `request failed: status ${response.status}`
      }

      // if we can get the structured error we should, otherwise give a best effort
      try {
        const text = await response.text()

        try {
          const jsonBody = JSON.parse(text)
          if (isAPIErrorResponse(jsonBody)) {
            body = jsonBody
          } else {
            body.message += ": " + JSON.stringify(jsonBody)
          }
        } catch {
          body.message += ": " + text
        }
      } catch (e) {
        // otherwise we just append the text to the error message
        body.message += ": " + String(e)
      }

      throw new APIError(response.status, body)
    }

    return response
  }
}

/**
 * APIErrorDetails represents the response from an Encore API in the case of an error
 */
interface APIErrorResponse {
  code: ErrCode
  message: string
  details?: any
}

function isAPIErrorResponse(err: any): err is APIErrorResponse {
  return (
    err !== undefined &&
    err !== null &&
    isErrCode(err.code) &&
    typeof err.message === "string" &&
    (err.details === undefined ||
      err.details === null ||
      typeof err.details === "object")
  )
}

function isErrCode(code: any): code is ErrCode {
  return code !== undefined && Object.values(ErrCode).includes(code)
}

/**
 * APIError represents a structured error as returned from an Encore application.
 */
export class APIError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  public readonly status: number

  /**
   * The Encore error code
   */
  public readonly code: ErrCode

  /**
   * The error details
   */
  public readonly details?: any

  constructor(status: number, response: APIErrorResponse) {
    // extending errors causes issues after you construct them, unless you apply the following fixes
    super(response.message)

    // set error name as constructor name, make it not enumerable to keep native Error behavior
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target#new.target_in_constructors
    Object.defineProperty(this, "name", {
      value: "APIError",
      enumerable: false,
      configurable: true
    })

    // fix the prototype chain
    if ((Object as any).setPrototypeOf == undefined) {
      ;(this as any).__proto__ = APIError.prototype
    } else {
      Object.setPrototypeOf(this, APIError.prototype)
    }

    // capture a stack trace
    if ((Error as any).captureStackTrace !== undefined) {
      ;(Error as any).captureStackTrace(this, this.constructor)
    }

    this.status = status
    this.code = response.code
    this.details = response.details
  }
}

/**
 * Typeguard allowing use of an APIError's fields'
 */
export function isAPIError(err: any): err is APIError {
  return err instanceof APIError
}

export enum ErrCode {
  /**
   * OK indicates the operation was successful.
   */
  OK = "ok",

  /**
   * Canceled indicates the operation was canceled (typically by the caller).
   *
   * Encore will generate this error code when cancellation is requested.
   */
  Canceled = "canceled",

  /**
   * Unknown error. An example of where this error may be returned is
   * if a Status value received from another address space belongs to
   * an error-space that is not known in this address space. Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   *
   * Encore will generate this error code in the above two mentioned cases.
   */
  Unknown = "unknown",

  /**
   * InvalidArgument indicates client specified an invalid argument.
   * Note that this differs from FailedPrecondition. It indicates arguments
   * that are problematic regardless of the state of the system
   * (e.g., a malformed file name).
   *
   * This error code will not be generated by the gRPC framework.
   */
  InvalidArgument = "invalid_argument",

  /**
   * DeadlineExceeded means operation expired before completion.
   * For operations that change the state of the system, this error may be
   * returned even if the operation has completed successfully. For
   * example, a successful response from a server could have been delayed
   * long enough for the deadline to expire.
   *
   * The gRPC framework will generate this error code when the deadline is
   * exceeded.
   */
  DeadlineExceeded = "deadline_exceeded",

  /**
   * NotFound means some requested entity (e.g., file or directory) was
   * not found.
   *
   * This error code will not be generated by the gRPC framework.
   */
  NotFound = "not_found",

  /**
   * AlreadyExists means an attempt to create an entity failed because one
   * already exists.
   *
   * This error code will not be generated by the gRPC framework.
   */
  AlreadyExists = "already_exists",

  /**
   * PermissionDenied indicates the caller does not have permission to
   * execute the specified operation. It must not be used for rejections
   * caused by exhausting some resource (use ResourceExhausted
   * instead for those errors). It must not be
   * used if the caller cannot be identified (use Unauthenticated
   * instead for those errors).
   *
   * This error code will not be generated by the gRPC core framework,
   * but expect authentication middleware to use it.
   */
  PermissionDenied = "permission_denied",

  /**
   * ResourceExhausted indicates some resource has been exhausted, perhaps
   * a per-user quota, or perhaps the entire file system is out of space.
   *
   * This error code will be generated by the gRPC framework in
   * out-of-memory and server overload situations, or when a message is
   * larger than the configured maximum size.
   */
  ResourceExhausted = "resource_exhausted",

  /**
   * FailedPrecondition indicates operation was rejected because the
   * system is not in a state required for the operation's execution.
   * For example, directory to be deleted may be non-empty, an rmdir
   * operation is applied to a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FailedPrecondition, Aborted, and Unavailable:
   *  (a) Use Unavailable if the client can retry just the failing call.
   *  (b) Use Aborted if the client should retry at a higher-level
   *      (e.g., restarting a read-modify-write sequence).
   *  (c) Use FailedPrecondition if the client should not retry until
   *      the system state has been explicitly fixed. E.g., if an "rmdir"
   *      fails because the directory is non-empty, FailedPrecondition
   *      should be returned since the client should not retry unless
   *      they have first fixed up the directory by deleting files from it.
   *  (d) Use FailedPrecondition if the client performs conditional
   *      REST Get/Update/Delete on a resource and the resource on the
   *      server does not match the condition. E.g., conflicting
   *      read-modify-write on the same resource.
   *
   * This error code will not be generated by the gRPC framework.
   */
  FailedPrecondition = "failed_precondition",

  /**
   * Aborted indicates the operation was aborted, typically due to a
   * concurrency issue like sequencer check failures, transaction aborts,
   * etc.
   *
   * See litmus test above for deciding between FailedPrecondition,
   * Aborted, and Unavailable.
   */
  Aborted = "aborted",

  /**
   * OutOfRange means operation was attempted past the valid range.
   * E.g., seeking or reading past end of file.
   *
   * Unlike InvalidArgument, this error indicates a problem that may
   * be fixed if the system state changes. For example, a 32-bit file
   * system will generate InvalidArgument if asked to read at an
   * offset that is not in the range [0,2^32-1], but it will generate
   * OutOfRange if asked to read from an offset past the current
   * file size.
   *
   * There is a fair bit of overlap between FailedPrecondition and
   * OutOfRange. We recommend using OutOfRange (the more specific
   * error) when it applies so that callers who are iterating through
   * a space can easily look for an OutOfRange error to detect when
   * they are done.
   *
   * This error code will not be generated by the gRPC framework.
   */
  OutOfRange = "out_of_range",

  /**
   * Unimplemented indicates operation is not implemented or not
   * supported/enabled in this service.
   *
   * This error code will be generated by the gRPC framework. Most
   * commonly, you will see this error code when a method implementation
   * is missing on the server. It can also be generated for unknown
   * compression algorithms or a disagreement as to whether an RPC should
   * be streaming.
   */
  Unimplemented = "unimplemented",

  /**
   * Internal errors. Means some invariants expected by underlying
   * system has been broken. If you see one of these errors,
   * something is very broken.
   *
   * This error code will be generated by the gRPC framework in several
   * internal error conditions.
   */
  Internal = "internal",

  /**
   * Unavailable indicates the service is currently unavailable.
   * This is a most likely a transient condition and may be corrected
   * by retrying with a backoff. Note that it is not always safe to retry
   * non-idempotent operations.
   *
   * See litmus test above for deciding between FailedPrecondition,
   * Aborted, and Unavailable.
   *
   * This error code will be generated by the gRPC framework during
   * abrupt shutdown of a server process or network connection.
   */
  Unavailable = "unavailable",

  /**
   * DataLoss indicates unrecoverable data loss or corruption.
   *
   * This error code will not be generated by the gRPC framework.
   */
  DataLoss = "data_loss",

  /**
   * Unauthenticated indicates the request does not have valid
   * authentication credentials for the operation.
   *
   * The gRPC framework will generate this error code when the
   * authentication metadata is invalid or a Credentials callback fails,
   * but also expect authentication middleware to generate it.
   */
  Unauthenticated = "unauthenticated"
}
