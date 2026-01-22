export interface Attachment {
  id: string
  name: string
  url: string
}

export interface Message {
  _id: string
  channel_id: string
  author_id: string
  content: string
  reply_to_message_id?: string | null
  attachments: Attachment[]
  is_pinned: boolean
  created_at: string
  updated_at?: string | null
}

export interface MessagePagination {
  page: number
  limit: number
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
