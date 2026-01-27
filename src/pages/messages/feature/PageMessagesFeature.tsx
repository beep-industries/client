import { useReducer, useCallback, useMemo, useEffect, useState } from "react"
import PageMessages from "../ui/PageMessages"
import { messagesReducer, initialMessagesState } from "../reducers/MessageReducer"

import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useCreateMessage, useMessages } from "@/shared/queries/message/message.queries"
import type { CreateMessageRequest, Message } from "@/shared/queries/message/message.types"
import { RealTimeEventProvider } from "@/app/providers/RealTimeEventProvider.tsx"
import type {
  MessageCreatedEvent,
  MessageDeletedEvent,
  MessageUpdatedEvent,
} from "@/shared/queries/real-time/event.types"
import { useServerMembers } from "@/shared/queries/community/community.queries"
import type { GetServerMembersResponse } from "@/shared/queries/community/community.types"
import { useCurrentUser, useUsersBatch } from "@/shared/queries/user/user.queries"
import type { UserBasicInfo } from "@/shared/queries/user/user.types"
import type { MentionMember } from "@/shared/components/MentionPopover"

interface PageMessagesFeatureProps {
  channelId: string
  serverId: string
}

export default function PageMessagesFeature({ channelId, serverId }: PageMessagesFeatureProps) {
  const [messagesState, dispatch] = useReducer(messagesReducer, initialMessagesState)
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null)
  const { accessToken } = useAuth()

  // Get current user for mention highlighting
  const { data: currentUser } = useCurrentUser()

  // Aggregate fetched and live messages into oneKeycloakAuthRepository list
  const allMessages = useMemo(() => {
    return [...messagesState.fetchedMessages, ...messagesState.liveMessages]
  }, [messagesState.fetchedMessages, messagesState.liveMessages])

  // Fetch server members for mentions
  const { data: membersData } = useServerMembers(serverId)
  const memberUserIds = useMemo(() => {
    if (!membersData?.pages) return []
    return membersData.pages.flatMap((page: GetServerMembersResponse) =>
      page.data.map((member) => member.user_id)
    )
  }, [membersData])

  const { data: usersData } = useUsersBatch(memberUserIds)

  const mentionMembers: MentionMember[] = useMemo(() => {
    if (!usersData) return []
    return usersData.map((user: UserBasicInfo) => ({
      userId: user.sub,
      displayName: user.display_name,
      avatarUrl: user.profile_picture,
    }))
  }, [usersData])

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

  // Handle message.created event
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

  // Handle message.deleted event
  const onEventDeletedHandler = (event: MessageDeletedEvent) => {
    // Remove from liveMessages if present
    if (messagesState.liveMessages.some((m) => m._id === event.message_id)) {
      dispatch({ type: "DELETE_LIVE_MESSAGE", payload: event.message_id })
    }
    // Remove from fetchedMessages if present
    if (messagesState.fetchedMessages.some((m) => m._id === event.message_id)) {
      dispatch({ type: "DELETE_FETCHED_MESSAGE", payload: event.message_id })
    }
  }

  const onEventUpdatedHandler = (event: MessageUpdatedEvent) => {
    // Update message content in liveMessages if present
    if (messagesState.liveMessages.some((m) => m._id === event.message_id)) {
      dispatch({
        type: "UPDATE_LIVE_MESSAGE",
        payload: {
          id: event.message_id,
          message: { content: event.content, is_pinned: event.is_pinned },
        },
      })
    }
    // Update message content in fetchedMessages if present
    if (messagesState.fetchedMessages.some((m) => m._id === event.message_id)) {
      dispatch({
        type: "UPDATE_FETCHED_MESSAGE",
        payload: {
          id: event.message_id,
          message: { content: event.content, is_pinned: event.is_pinned },
        },
      })
    }
  }

  // Load fetched messages into state
  useEffect(() => {
    if (messagesData) {
      const allFetchedMessages = messagesData.pages.flatMap((page) => page.data)
      dispatch({ type: "SET_FETCHED_MESSAGES", payload: allFetchedMessages })
      dispatch({ type: "CLEAR_LIVE_MESSAGES" })
    }
  }, [messagesData])

  // TODO: Implement logic for websocket live messages

  // Adapters to cast payload from unknown to correct type
  const handleCreated = (payload: unknown) => {
    onEventChannelHandler(payload as MessageCreatedEvent)
  }
  const handleDeleted = (payload: unknown) => {
    onEventDeletedHandler(payload as MessageDeletedEvent)
  }

  const handleUpdated = (payload: unknown) => {
    onEventUpdatedHandler(payload as MessageUpdatedEvent)
  }

  function handleSetReplyingMessage(id: string | null) {
    if (id === null) {
      setReplyingMessage(null)
    } else {
      const msg =
        allMessages.find((m) => m._id === id) ||
        messagesState.liveMessages.find((m) => m._id === id) ||
        null
      setReplyingMessage(msg)
    }
  }

  return (
    <RealTimeEventProvider
      topic={`text-channel:${channelId}`}
      events={[
        { event: "message.created", onEvent: handleCreated },
        { event: "message.deleted", onEvent: handleDeleted },
        { event: "message.updated", onEvent: handleUpdated },
      ]}
    >
      <PageMessages
        messages={allMessages}
        sendMessage={sendMessage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        members={mentionMembers}
        currentUserDisplayName={currentUser?.display_name}
        replyingMessage={replyingMessage}
        setReplyingMessage={handleSetReplyingMessage}
      />
    </RealTimeEventProvider>
  )
}
