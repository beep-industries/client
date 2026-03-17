import { api } from ".."
import type { CommunityPagination } from "../common"
import type { CreateMemberRequest } from "./member.request"

export const getServerMembers = (serverId: string, query: CommunityPagination) => {
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get(`servers/${serverId}/members`, { searchParams }).json()
}

export const createMember = ({ server_id }: CreateMemberRequest) => {
  return api.requester.post(`servers/${server_id}/members`).json()
}
