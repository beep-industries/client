import ky from "ky"

const MESSAGE_SERVICE_URL = import.meta.env.VITE_MESSAGE_SERVICE_URL

const createMessageApi = (accessToken: string) =>
  ky.create({
    prefixUrl: MESSAGE_SERVICE_URL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

// Types matching the OpenAPI spec
export interface Attachment {
  id: string // AttachmentId (UUID)
  name: string
  url: string
}

export interface Message {
  _id: string // MessageId (UUID)
  channel_id: string // ChannelId (UUID)
  author_id: string // AuthorId (UUID)
  content: string
  reply_to_message_id?: string | null // MessageId (UUID) or null
  attachments: Attachment[]
  is_pinned: boolean
  created_at: string // ISO 8601 date-time
  updated_at?: string | null // ISO 8601 date-time or null
}

export interface PaginatedMessagesResponse {
  data: Message[]
  total: number
  page: number
}

export interface CreateMessageRequest {
  channel_id: string
  content: string
  attachments: Attachment[]
  reply_to_message_id?: string | null
}

export interface UpdateMessageRequest {
  content?: string | null
  is_pinned?: boolean | null
}

// GET /messages - List messages with pagination
export const listMessages = async (
  accessToken: string,
  page: number,
  limit: number
): Promise<PaginatedMessagesResponse> => {
  const api = createMessageApi(accessToken)
  return api
    .get("messages", {
      searchParams: { page, limit },
    })
    .json<PaginatedMessagesResponse>()
}

// POST /messages - Create a new message
export const createMessage = async (
  accessToken: string,
  messageData: CreateMessageRequest
): Promise<Message> => {
  const api = createMessageApi(accessToken)
  return api.post("messages", { json: messageData }).json<Message>()
}

// GET /messages/{id} - Get a single message
export const getMessage = async (accessToken: string, id: string): Promise<Message> => {
  const api = createMessageApi(accessToken)
  return api.get(`messages/${id}`).json<Message>()
}

// PUT /messages/{id} - Update a message
export const updateMessage = async (
  accessToken: string,
  id: string,
  messageData: UpdateMessageRequest
): Promise<Message> => {
  const api = createMessageApi(accessToken)
  return api.put(`messages/${id}`, { json: messageData }).json<Message>()
}

// DELETE /messages/{id} - Delete a message
export const deleteMessage = async (accessToken: string, id: string): Promise<void> => {
  const api = createMessageApi(accessToken)
  return api.delete(`messages/${id}`).json<void>()
}
