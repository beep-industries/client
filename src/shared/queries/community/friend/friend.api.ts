import { api } from ".."
import type { CommunityPagination } from "../common"
import type {
  AcceptFriendRequestRequest,
  CreateFriendRequestRequest,
  DeclineFriendRequestRequest,
  DeleteFriendRequest,
  DeleteFriendRequestRequest,
} from "./friend.request"

export const getFriendRequests = (query: CommunityPagination) => {
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get("friend-requests", { searchParams }).json()
}

export const getFriendInvitations = (query: CommunityPagination) => {
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get("friend-invitations", { searchParams }).json()
}

export const createFriendRequest = (body: CreateFriendRequestRequest) => {
  return api.requester.post("friend-requests", { json: body }).json()
}

export const acceptFriendRequest = (body: AcceptFriendRequestRequest) => {
  return api.requester.post("friend-requests/accept", { json: body }).json()
}

export const declineFriendRequest = (body: DeclineFriendRequestRequest) => {
  return api.requester.post("friend-requests/decline", { json: body }).json()
}

export const deleteFriendRequest = (body: DeleteFriendRequestRequest) => {
  return api.requester.delete(`friend-requests/${body.user_id_invited}`).json()
}

export const getFriends = (query: CommunityPagination) => {
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get("friends", { searchParams }).json()
}

export const deleteFriend = (body: DeleteFriendRequest) => {
  return api.requester.delete(`friends/${body.friend_id}`).json()
}
