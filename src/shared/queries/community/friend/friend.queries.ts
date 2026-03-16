import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import {
  MAXIMUM_FRIEND_INVITATIONS_PER_API_CALL,
  MAXIMUM_FRIEND_REQUESTS_PER_API_CALL,
  MAXIMUM_FRIENDS_PER_API_CALL,
} from "@/shared/constants/community.contants"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import {
  acceptFriendRequest,
  createFriendRequest,
  declineFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  getFriendInvitations,
  getFriendRequests,
  getFriends,
} from "./friend.api"
import type {
  AcceptFriendRequestRequest,
  CreateFriendRequestRequest,
  DeclineFriendRequestRequest,
  DeleteFriendRequestRequest,
} from "./friend.request"
import type {
  GetFriendInvitationsResponse,
  GetFriendRequestsResponse,
  GetFriendsResponse,
} from "./friend.response"

export const friendKeys = {
  all: ["friend"] as const,
  friends: () => [...friendKeys.all, "friends"] as const,
  friendRequests: () => [...friendKeys.all, "friend-requests"] as const,
  friendInvitations: () => [...friendKeys.all, "friend-invitations"] as const,
}

export const useFriendRequests = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: friendKeys.friendRequests(),
    queryFn: async ({ pageParam }): Promise<GetFriendRequestsResponse> => {
      try {
        const response = await getFriendRequests({
          page: pageParam,
          limit: MAXIMUM_FRIEND_REQUESTS_PER_API_CALL,
        })

        return response as GetFriendRequestsResponse
      } catch (error) {
        console.error("Error fetching friend requests:", error)
        throw new Error("Error fetching friend requests")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_FRIEND_REQUESTS_PER_API_CALL < lastPage.total) {
        return lastPage.page + 1
      }
    },
    enabled: !!accessToken,
  })
}

export const useFriendInvitations = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: friendKeys.friendInvitations(),
    queryFn: async ({ pageParam }): Promise<GetFriendInvitationsResponse> => {
      try {
        const response = await getFriendInvitations({
          page: pageParam,
          limit: MAXIMUM_FRIEND_INVITATIONS_PER_API_CALL,
        })

        return response as GetFriendInvitationsResponse
      } catch (error) {
        console.error("Error fetching friend invitations:", error)
        throw new Error("Error fetching friend invitations")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_FRIEND_INVITATIONS_PER_API_CALL < lastPage.total) {
        return lastPage.page + 1
      }
    },
    enabled: !!accessToken,
  })
}

export const useCreateFriendRequest = () => {
  return useMutation({
    mutationFn: (body: CreateFriendRequestRequest) => createFriendRequest(body),
  })
}

export const useAcceptFriendRequest = () => {
  return useMutation({
    mutationFn: (body: AcceptFriendRequestRequest) => acceptFriendRequest(body),
  })
}

export const useDeclineFriendRequest = () => {
  return useMutation({
    mutationFn: (body: DeclineFriendRequestRequest) => declineFriendRequest(body),
  })
}

export const useDeleteFriendRequest = () => {
  return useMutation({
    mutationFn: (body: DeleteFriendRequestRequest) => deleteFriendRequest(body),
  })
}

export const useFriends = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: friendKeys.friends(),
    queryFn: async ({ pageParam }): Promise<GetFriendsResponse> => {
      try {
        const response = await getFriends({
          page: pageParam,
          limit: MAXIMUM_FRIENDS_PER_API_CALL,
        })

        return response as GetFriendsResponse
      } catch (error) {
        console.error("Error fetching friends:", error)
        throw new Error("Error fetching friends")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_FRIENDS_PER_API_CALL < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken,
  })
}

export const useDeleteFriend = () => {
  return useMutation({
    mutationFn: (friend_id: string) => deleteFriend({ friend_id }),
  })
}
