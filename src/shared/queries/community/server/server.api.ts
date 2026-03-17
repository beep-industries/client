import { api } from ".."
import type { CommunityPagination } from "../common"
import type {
  CreateServerInvitation,
  CreateServerRequest,
  UpdateServerRequest,
} from "./server.request"
import { computeExpiration } from "./server.request"

export const createServer = (body: CreateServerRequest) => {
  return api.requester.post("servers", { json: body }).json()
}

export const getServers = (query: CommunityPagination) => {
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get("servers/@me", { searchParams }).json()
}

export const getServerById = (serverId: string) => {
  return api.requester.get(`servers/${serverId}`).json()
}

export const updateServer = (serverId: string, body: UpdateServerRequest) => {
  return api.requester.put(`servers/${serverId}`, { json: body }).json()
}

export const deleteServer = (serverId: string) => {
  return api.requester.delete(`servers/${serverId}`).json()
}

export const createServerInvitation = ({ server_id, expire_in }: CreateServerInvitation) => {
  const body = computeExpiration(expire_in)
  return api.requester.post(`servers/${server_id}/invitations`, { json: body }).json()
}

export const acceptServerInvitation = (invitationId: string) => {
  return api.requester.post(`invitations/${invitationId}/accept`).json()
}

export const searchOrDiscoverServer = (search_query: string, query: CommunityPagination) => {
  const searchParams = {
    q: search_query,
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get("servers/search", { searchParams }).json()
}
