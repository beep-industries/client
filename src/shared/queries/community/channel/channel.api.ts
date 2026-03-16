import { api } from ".."
import type { CreateServerChannelRequest, UpdateServerChannelRequest } from "./channel.request"

export const getChannels = (serverId: string) => {
  return api.requester.get(`servers/${serverId}/channels`).json()
}

export const createChannel = (serverId: string, body: CreateServerChannelRequest) => {
  return api.requester.post(`servers/${serverId}/channels`, { json: body }).json()
}

export const deleteChannel = (channelId: string) => {
  return api.requester.delete(`channels/${channelId}`).json()
}

export const getChannel = (channelId: string) => {
  return api.requester.get(`channels/${channelId}`).json()
}

export const updateChannel = (channelId: string, body: UpdateServerChannelRequest) => {
  return api.requester.put(`channels/${channelId}`, { json: body }).json()
}
