import ky from "ky"
import type {
  CommunityPagination,
  CreateServerRequest,
  UpdateServerRequest,
  CreateServerChannelRequest,
  UpdateServerChannelRequest,
} from "./community.types"

const createCommunityApi = (accessToken: string) =>
  ky.create({
    prefixUrl: import.meta.env.VITE_COMMUNITY_SERVICE_URL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

export const getServers = (accessToken: string, query: CommunityPagination) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get("servers", { searchParams }).json()
}

export const getServerById = (accessToken: string, serverId: string) => {
  const api = createCommunityApi(accessToken)
  return api.get(`servers/${serverId}`).json()
}

export const createServer = (accessToken: string, body: CreateServerRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post("servers", { json: body }).json()
}

export const updateServer = (accessToken: string, serverId: string, body: UpdateServerRequest) => {
  const api = createCommunityApi(accessToken)
  return api.patch(`servers/${serverId}`, { json: body }).json()
}

export const deleteServer = (accessToken: string, serverId: string) => {
  const api = createCommunityApi(accessToken)
  return api.delete(`servers/${serverId}`).json()
}

export const getChannels = (accessToken: string, serverId: string) => {
  const api = createCommunityApi(accessToken)
  return api.get(`servers/${serverId}/channels`).json()
}

export const createChannel = (
  accessToken: string,
  serverId: string,
  body: CreateServerChannelRequest
) => {
  const api = createCommunityApi(accessToken)
  return api.post(`servers/${serverId}/channels`, { json: body }).json()
}

export const deleteChannel = (accessToken: string, channelId: string) => {
  const api = createCommunityApi(accessToken)
  return api.delete(`channels/${channelId}`).json()
}

export const updateChannel = (
  accessToken: string,
  channelId: string,
  body: UpdateServerChannelRequest
) => {
  const api = createCommunityApi(accessToken)
  return api.put(`channels/${channelId}`, { json: body }).json()
}
