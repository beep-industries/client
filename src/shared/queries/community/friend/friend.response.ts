import type { Friend, FriendInvitation, FriendRequest } from "./friend.types"

export interface GetFriendRequestsResponse {
  data: FriendRequest[]
  page: number
  total: number
}

export interface GetFriendInvitationsResponse {
  data: FriendInvitation[]
  page: number
  total: number
}

export interface GetFriendsResponse {
  data: Friend[]
  page: number
  total: number
}
