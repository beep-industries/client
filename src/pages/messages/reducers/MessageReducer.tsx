// Message type based on backend entity
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

// State type
export interface MessagesState {
  fetchedMessages: Message[]
  liveMessages: Message[]
}

// Action types
export type MessagesAction =
  | { type: "SET_FETCHED_MESSAGES"; payload: Message[] }
  | { type: "ADD_FETCHED_MESSAGE"; payload: Message }
  | { type: "UPDATE_FETCHED_MESSAGE"; payload: { id: string; message: Partial<Message> } }
  | { type: "DELETE_FETCHED_MESSAGE"; payload: string }
  | { type: "CLEAR_FETCHED_MESSAGES" }
  | { type: "ADD_LIVE_MESSAGE"; payload: Message }
  | { type: "UPDATE_LIVE_MESSAGE"; payload: { id: string; message: Partial<Message> } }
  | { type: "DELETE_LIVE_MESSAGE"; payload: string }
  | { type: "CLEAR_LIVE_MESSAGES" }
  | { type: "MERGE_LIVE_TO_FETCHED" }

// Reducer function
export function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
  switch (action.type) {
    case "SET_FETCHED_MESSAGES":
      return { ...state, fetchedMessages: action.payload }

    case "ADD_FETCHED_MESSAGE":
      return {
        ...state,
        fetchedMessages: [...state.fetchedMessages, action.payload],
      }

    case "UPDATE_FETCHED_MESSAGE":
      return {
        ...state,
        fetchedMessages: state.fetchedMessages.map((msg) =>
          msg._id === action.payload.id ? { ...msg, ...action.payload.message } : msg
        ),
      }

    case "DELETE_FETCHED_MESSAGE":
      return {
        ...state,
        fetchedMessages: state.fetchedMessages.filter((msg) => msg._id !== action.payload),
      }

    case "CLEAR_FETCHED_MESSAGES":
      return { ...state, fetchedMessages: [] }

    case "ADD_LIVE_MESSAGE":
      return {
        ...state,
        liveMessages: [...state.liveMessages, action.payload],
      }

    case "UPDATE_LIVE_MESSAGE":
      return {
        ...state,
        liveMessages: state.liveMessages.map((msg) =>
          msg._id === action.payload.id ? { ...msg, ...action.payload.message } : msg
        ),
      }

    case "DELETE_LIVE_MESSAGE":
      return {
        ...state,
        liveMessages: state.liveMessages.filter((msg) => msg._id !== action.payload),
      }

    case "CLEAR_LIVE_MESSAGES":
      return { ...state, liveMessages: [] }

    case "MERGE_LIVE_TO_FETCHED":
      return {
        ...state,
        fetchedMessages: [...state.fetchedMessages, ...state.liveMessages],
        liveMessages: [],
      }

    default:
      return state
  }
}

// Initial state
export const initialMessagesState: MessagesState = {
  fetchedMessages: [],
  liveMessages: [],
}
