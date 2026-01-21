import { useReducer, useCallback, useMemo, useEffect } from "react"
import PageMessages from "../ui/PageMessages"
import { messagesReducer, initialMessagesState } from "../reducers/MessageReducer"

import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useCreateMessage, useMessages } from "@/shared/queries/message/message.queries"
import type { CreateMessageRequest } from "@/shared/queries/message/message.types"

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

  // Send a new message
  const sendMessage = useCallback(
    async (messageData: Omit<CreateMessageRequest, "channel_id">) => {
      if (!accessToken) throw new Error("No access token available")
      try {
        const newMessage = await createMessageMutation.mutateAsync({
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
    [accessToken, channelId, createMessageMutation]
  )

  // Load fetched messages into state
  useEffect(() => {
    if (messagesData) {
      const allFetchedMessages = messagesData.pages.flatMap((page) => page.data)
      dispatch({ type: "SET_FETCHED_MESSAGES", payload: allFetchedMessages })
    }
  }, [messagesData])

  // TODO: Implement logic for websocket live messages

  return (
    <PageMessages
      messages={allMessages}
      sendMessage={sendMessage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  )
}
