import ky from "ky"
import {
  type AcceptFriendRequestRequest,
  type CommunityPagination,
  type CreateFriendRequestRequest,
  type CreateServerRequest,
  type DeclineFriendRequestRequest,
  type DeleteFriendRequest,
  type DeleteFriendRequestRequest,
  type UpdateServerRequest,
  type CreateServerChannelRequest,
  type UpdateServerChannelRequest,
  type CreateServerInvitation,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  type AssignRoleRequest,
  type UnassignRoleRequest,
  computeExpiration,
  type CreateMemberRequest,
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
  return api.get("servers/@me", { searchParams }).json()
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
  return api.put(`servers/${serverId}`, { json: body }).json()
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

export const getChannel = (accessToken: string, channelId: string) => {
  const api = createCommunityApi(accessToken)
  return api.get(`channels/${channelId}`).json()
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
  return api.delete(`friends/${body.friend_id}`).json()
}

export const createServerInvitation = (
  accessToken: string,
  { server_id, expire_in }: CreateServerInvitation
) => {
  const api = createCommunityApi(accessToken)
  const body = computeExpiration(expire_in)
  return api.post(`servers/${server_id}/invitations`, { json: body }).json()
}

export const acceptServerInvitation = (accessToken: string, invitationId: string) => {
  const api = createCommunityApi(accessToken)
  return api.post(`invitations/${invitationId}/accept`).json()
}

export const getServerMembers = (
  accessToken: string,
  serverId: string,
  query: CommunityPagination
) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get(`servers/${serverId}/members`, { searchParams }).json()
}

export const createMember = (accessToken: string, { server_id }: CreateMemberRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post(`servers/${server_id}/members`).json()
}

export const searchOrDiscoverServer = (
  accessToken: string,
  search_query: string,
  query: CommunityPagination
) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    q: search_query,
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get(`servers/search`, { searchParams }).json()
}

export const getRoles = (accessToken: string, serverId: string) => {
  const api = createCommunityApi(accessToken)
  return api.get(`servers/${serverId}/roles`).json()
}

export const getRole = (accessToken: string, roleId: string) => {
  const api = createCommunityApi(accessToken)
  return api.get(`roles/${roleId}`).json()
}

export const createRole = (accessToken: string, serverId: string, body: CreateRoleRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post(`servers/${serverId}/roles`, { json: body }).json()
}

export const updateRole = (accessToken: string, roleId: string, body: UpdateRoleRequest) => {
  const api = createCommunityApi(accessToken)
  return api.put(`roles/${roleId}`, { json: body }).json()
}

export const deleteRole = (accessToken: string, roleId: string) => {
  const api = createCommunityApi(accessToken)
  return api.delete(`roles/${roleId}`).json()
}

export const assignRole = (accessToken: string, { role_id, member_id }: AssignRoleRequest) => {
  const api = createCommunityApi(accessToken)
  return api.post(`roles/${role_id}/members/${member_id}`).json()
}

export const unassignRole = (accessToken: string, { role_id, member_id }: UnassignRoleRequest) => {
  const api = createCommunityApi(accessToken)
  return api.delete(`roles/${role_id}/members/${member_id}`).json()
}

export const getRoleMembers = (accessToken: string, roleId: string, query: CommunityPagination) => {
  const api = createCommunityApi(accessToken)
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.get(`roles/${roleId}/members`, { searchParams }).json()
}
