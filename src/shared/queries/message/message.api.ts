import ky from "ky"
import type {
  MessagePagination,
  CreateMessageRequest,
  UpdateMessageRequest,
  PaginatedMessagesResponse,
  Message,
} from "./message.types"

const createMessageApi = (accessToken: string) =>
  ky.create({
    prefixUrl: import.meta.env.VITE_MESSAGE_SERVICE_URL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

export const listMessages = (
  accessToken: string,
  query: MessagePagination,
  channelId: string
): Promise<PaginatedMessagesResponse> => {
  const api = createMessageApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api
    .get(`channels/${channelId}/messages`, { searchParams })
    .json<PaginatedMessagesResponse>()
}

export const getMessage = (accessToken: string, messageId: string): Promise<Message> => {
  const api = createMessageApi(accessToken)
  return api.get(`messages/${messageId}`).json<Message>()
}

export const createMessage = (
  accessToken: string,
  body: CreateMessageRequest
): Promise<Message> => {
  const api = createMessageApi(accessToken)
  return api.post("messages", { json: body }).json<Message>()
}

export const updateMessage = (
  accessToken: string,
  messageId: string,
  body: UpdateMessageRequest
): Promise<Message> => {
  const api = createMessageApi(accessToken)
  return api.put(`messages/${messageId}`, { json: body }).json<Message>()
}

export const deleteMessage = (accessToken: string, messageId: string): Promise<void> => {
  const api = createMessageApi(accessToken)
  return api.delete(`messages/${messageId}`).json<void>()
}
