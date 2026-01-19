import { useReducer, useCallback, useMemo, useEffect } from "react"
import PageMessages from "../ui/PageMessages"
import { messagesReducer, initialMessagesState } from "../reducers/MessageReducer"
import {
  listMessages,
  createMessage,
  type CreateMessageRequest,
} from "@/shared/queries/message/message.queries"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"

interface PageMessagesFeatureProps {
  channelId: string
}

export default function PageMessagesFeature({ channelId }: PageMessagesFeatureProps) {
  const [messagesState, dispatch] = useReducer(messagesReducer, initialMessagesState)
  const { accessToken } = useAuth()

  // Aggregate fetched and live messages into oneKeycloakAuthRepository list
  const allMessages = useMemo(() => {
    return [...messagesState.fetchedMessages, ...messagesState.liveMessages]
  }, [messagesState.fetchedMessages, messagesState.liveMessages])

  // Fetch messages from API
  const fetchMessages = useCallback(
    async (page: number, limit: number) => {
      if (!accessToken) throw new Error("No access token available")
      try {
        const response = await listMessages(accessToken, page, limit)
        dispatch({ type: "SET_FETCHED_MESSAGES", payload: response.data })
        return response
      } catch (error) {
        console.error("Error fetching messages:", error)
        throw error
      }
    },
    [accessToken]
  )

  useEffect(() => {
    // Initial fetch
    fetchMessages(1, 50).catch((error) => {
      console.error("Failed to fetch messages on mount:", error)
    })
  }, [fetchMessages])

  // Send a new message
  const sendMessage = useCallback(
    async (messageData: Omit<CreateMessageRequest, "channel_id">) => {
      if (!accessToken) throw new Error("No access token available")
      try {
        const newMessage = await createMessage(accessToken, {
          ...messageData,
          channel_id: channelId,
        })
        dispatch({ type: "ADD_FETCHED_MESSAGE", payload: newMessage })
        return newMessage
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      }
    },
    [accessToken, channelId]
  )

  // TODO: Implement logic for websocket live messages

  return <PageMessages messages={allMessages} sendMessage={sendMessage} />
}
