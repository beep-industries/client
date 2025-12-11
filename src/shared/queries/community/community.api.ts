import ky from "ky"
import type { CommunityPagination } from "./community.types"

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
