import ky from "ky"
import type {
  AcceptFriendRequestRequest,
  CommunityPagination,
  CreateFriendRequestRequest,
  CreateServerRequest,
  DeclineFriendRequestRequest,
  DeleteFriendRequest,
  DeleteFriendRequestRequest,
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

export const getFriendRequests = (accessToken: string, query: CommunityPagination) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get("friend-requests", { searchParams }).json()
}

export const getFriendInvitations = (accessToken: string, query: CommunityPagination) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get("friend-invitations", { searchParams }).json()
}

export const createFriendRequest = (accessToken: string, body: CreateFriendRequestRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post("friend-requests", { json: body }).json()
}

export const acceptFriendRequest = (accessToken: string, body: AcceptFriendRequestRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post("friend-requests/accept", { json: body }).json()
}

export const declineFriendRequest = (accessToken: string, body: DeclineFriendRequestRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post("friend-requests/decline", { json: body }).json()
}

export const deleteFriendRequest = (accessToken: string, body: DeleteFriendRequestRequest) => {
  const api = createCommunityApi(accessToken)
  return api.delete(`friend-requests/${body.user_id_invited}`).json()
}

export const getFriends = (accessToken: string, query: CommunityPagination) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get("friends", { searchParams }).json()
}

export const deleteFriend = (accessToken: string, body: DeleteFriendRequest) => {
  const api = createCommunityApi(accessToken)
  return api.delete("friends", { json: body }).json()
}
