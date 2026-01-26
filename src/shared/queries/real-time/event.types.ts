export interface MessageCreatedEvent {
  message_id: string
  channel_id: string
  author_id: string
  content: string
  created_at: string
  updated_at?: string
  reply_to_message_id?: string
}

export interface MessageDeletedEvent {
  message_id: string
  channel_id: string
}
