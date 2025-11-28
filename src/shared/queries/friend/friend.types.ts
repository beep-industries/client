import type { Friend } from "@/shared/models/friend"

export interface GetAllFriendsRequest {
  query: {
    page?: number
    limit?: number
  }
}

export interface GetAllFriendsResponse {
  data: Friend[]
  total: number
  page: number
}
