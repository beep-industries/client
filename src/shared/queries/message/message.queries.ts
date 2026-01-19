import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  createMessage,
  deleteMessage,
  getMessage,
  listMessages,
  updateMessage,
} from "./message.api"
import type {
  CreateMessageRequest,
  Message,
  PaginatedMessagesResponse,
  UpdateMessageRequest,
} from "./message.types"

const MESSAGES_PER_PAGE = 50

export const messageKeys = {
  all: [] as const,
  list: (channelId: string) => [...messageKeys.all, `messages-${channelId}`],
  detail: (messageId: string) => [...messageKeys.all, `message-${messageId}`],
}

export const useMessages = (channelId: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: messageKeys.list(channelId),
    queryFn: async ({ pageParam }): Promise<PaginatedMessagesResponse> => {
      try {
        const response = await listMessages(accessToken!, {
          page: pageParam,
          limit: MESSAGES_PER_PAGE,
        })

        return response as PaginatedMessagesResponse
      } catch (error) {
        console.error("Error fetching messages:", error)
        throw new Error("Error fetching messages")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MESSAGES_PER_PAGE < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken && !!channelId,
  })
}

export const useMessage = (messageId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: messageKeys.detail(messageId),
    queryFn: async (): Promise<Message> => {
      try {
        const response = await getMessage(accessToken!, messageId)
        return response as Message
      } catch (error) {
        console.error("Error fetching message:", error)
        throw new Error("Error fetching message")
      }
    },
    enabled: !!accessToken && !!messageId,
  })
}

export const useCreateMessage = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: CreateMessageRequest) => {
      return createMessage(accessToken!, body)
    },
  })
}

export const useUpdateMessage = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (payload: { messageId: string; body: UpdateMessageRequest }) => {
      return updateMessage(accessToken!, payload.messageId, payload.body)
    },
  })
}

export const useDeleteMessage = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (messageId: string) => {
      return deleteMessage(accessToken!, messageId)
    },
  })
}
