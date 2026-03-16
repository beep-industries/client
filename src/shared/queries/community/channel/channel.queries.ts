import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createChannel, deleteChannel, getChannel, getChannels, updateChannel } from "./channel.api"
import type { CreateServerChannelRequest, UpdateServerChannelRequest } from "./channel.request"
import type { Channel } from "./channel.types"

export const channelKeys = {
  all: ["channel"] as const,
  channels: (serverId: string) => [...channelKeys.all, `channels-${serverId}`] as const,
  channel: (channelId: string) => [...channelKeys.all, `channel-${channelId}`] as const,
}

export const useChannel = (channelId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: channelKeys.channel(channelId),
    queryFn: async (): Promise<Channel> => {
      try {
        const response = await getChannel(channelId)
        return response as Channel
      } catch (error) {
        console.error("Error fetching channel by ID:", error)
        throw new Error("Error fetching channel by ID")
      }
    },
    enabled: !!accessToken && !!channelId,
  })
}

export const useChannels = (serverId: string | undefined) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: channelKeys.channels(serverId!),
    queryFn: async (): Promise<Channel[]> => {
      try {
        const response = await getChannels(serverId!)
        return response as Channel[]
      } catch (error) {
        console.error("Error fetching channels:", error)
        throw new Error("Error fetching channels")
      }
    },
    enabled: !!accessToken && !!serverId,
  })
}

export const useCreateChannel = (serverId: string) => {
  return useMutation({
    mutationFn: (body: CreateServerChannelRequest) => createChannel(serverId, body),
  })
}

export const useDeleteChannel = () => {
  return useMutation({
    mutationFn: (channelId: string) => deleteChannel(channelId),
  })
}

export const useUpdateChannel = () => {
  return useMutation({
    mutationFn: (payload: { channelId: string; body: UpdateServerChannelRequest }) =>
      updateChannel(payload.channelId, payload.body),
  })
}
