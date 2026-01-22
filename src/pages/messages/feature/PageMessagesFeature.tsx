import { useReducer, useCallback, useMemo, useEffect } from "react"
import PageMessages from "../ui/PageMessages"
import { messagesReducer, initialMessagesState } from "../reducers/MessageReducer"

import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useCreateMessage, useMessages } from "@/shared/queries/message/message.queries"
import type { CreateMessageRequest, Message } from "@/shared/queries/message/message.types"
import { RealTimeEventProvider } from "@/app/providers/RealTimeEventProvider.tsx"
import type { MessageCreatedEvent } from "@/shared/queries/real-time/event.types"

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
  const {
    data: messagesData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessages(channelId)
  const createMessageMutation = useCreateMessage()

  // Send a new message (no optimistic, only after HTTP response)
  const sendMessage = useCallback(
    async (messageData: Omit<CreateMessageRequest, "channel_id">) => {
      if (!accessToken) throw new Error("No access token available")
      try {
        const newMessage = await createMessageMutation.mutateAsync({
          ...messageData,
          channel_id: channelId,
        })
        // Ajoute le message en "pending" (gris) jusqu'à confirmation socket
        dispatch({
          type: "ADD_LIVE_MESSAGE",
          payload: { ...newMessage, status: "pending" as const },
        })
        return newMessage
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      }
    },
    [accessToken, channelId, createMessageMutation]
  )

  // Helper pour convertir un event websocket en Message complet
  const toMessage = (event: MessageCreatedEvent): Message => ({
    _id: event.message_id,
    channel_id: event.channel_id,
    author_id: event.author_id,
    content: event.content,
    reply_to_message_id: event.reply_to_message_id ?? null,
    attachments: [],
    is_pinned: false,
    created_at: event.created_at || new Date().toISOString(),
    updated_at: event.updated_at ?? event.created_at ?? new Date().toISOString(),
  })

  // Réconciliation sur réception websocket : passe le message en 'sent' si id match
  const onEventChannelHandler = (event: MessageCreatedEvent) => {
    const msg = toMessage(event)
    const existingMsg = messagesState.liveMessages.find((m) => m._id === msg._id)
    if (existingMsg) {
      if (existingMsg.status === "pending") {
        dispatch({
          type: "UPDATE_LIVE_MESSAGE",
          payload: { id: existingMsg._id, message: { ...msg, status: "sent" as const } },
        })
      }
      return
    }
    dispatch({ type: "ADD_LIVE_MESSAGE", payload: { ...msg, status: "sent" as const } })
  }

  // Load fetched messages into state
  useEffect(() => {
    if (messagesData) {
      const allFetchedMessages = messagesData.pages.flatMap((page) => page.data)
      dispatch({ type: "SET_FETCHED_MESSAGES", payload: allFetchedMessages })
    }
  }, [messagesData])

  // TODO: Implement logic for websocket live messages

  return (
    <RealTimeEventProvider
      topic={`text-channel:${channelId}`}
      event={"message.created"}
      onEvent={onEventChannelHandler}
    >
      <PageMessages
        messages={allMessages}
        sendMessage={sendMessage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </RealTimeEventProvider>
  )
}
