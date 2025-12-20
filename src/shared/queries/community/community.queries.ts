import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  acceptFriendRequest,
  createFriendRequest,
  createServer,
  declineFriendRequest,
  deleteFriendRequest,
  deleteServer,
  getFriendInvitations,
  getFriendRequests,
  getFriends,
  getServerById,
  getServers,
  updateServer,
  getChannels,
  createChannel,
  deleteChannel,
  updateChannel,
} from "./community.api"
import type {
  AcceptFriendRequestRequest,
  CreateFriendRequestRequest,
  CreateServerRequest,
  DeclineFriendRequestRequest,
  DeleteFriendRequestRequest,
  GetFriendInvitationsResponse,
  GetFriendRequestsResponse,
  GetFriendsResponse,
  Server,
  Channel,
  CreateServerChannelRequest,
  UpdateServerChannelRequest,
  GetServersResponse,
} from "./community.types"
import {
  MAXIMUM_FRIEND_INVITATIONS_PER_API_CALL,
  MAXIMUM_FRIEND_REQUESTS_PER_API_CALL,
  MAXIMUM_FRIENDS_PER_API_CALL,
  MAXIMUM_SERVERS_PER_API_CALL,
} from "@/shared/constants/community.contants"

export const communityKeys = {
  all: [] as const,
  server: (serverId: string) => [...communityKeys.all, `server-${serverId}`],
  channels: (serverId: string) => [...communityKeys.all, `channels-${serverId}`],
}

export const useServerById = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.server(serverId),
    queryFn: async (): Promise<Server> => {
      try {
        const response = await getServerById(accessToken!, serverId)

        return response as Server
      } catch (error) {
        console.error("Error fetching server by ID:", error)
        throw new Error("Error fetching server by ID")
      }
    },
    enabled: !!accessToken,
  })
}

export const useServers = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ["servers"],
    queryFn: async ({ pageParam }): Promise<GetServersResponse> => {
      try {
        const response = await getServers(accessToken!, {
          page: pageParam,
          limit: MAXIMUM_SERVERS_PER_API_CALL,
        })

        return response as GetServersResponse
      } catch (error) {
        console.error("Error fetching servers:", error)
        throw new Error("Error fetching servers")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_SERVERS_PER_API_CALL < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken,
  })
}

export const useCreateServer = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: CreateServerRequest) => {
      return createServer(accessToken!, body)
    },
  })
}

export const useUpdateServer = (serverId: string) => {
  const { accessToken } = useAuth()

  return {
    mutate: (body: CreateServerRequest) => {
      return updateServer(accessToken!, serverId, body)
    },
    isLoading: !!accessToken,
  }
}

export const useDeleteServer = (serverId: string) => {
  const { accessToken } = useAuth()

  return {
    mutate: () => {
      return deleteServer(accessToken!, serverId)
    },
    isLoading: !!accessToken,
  }
}

export const useChannels = (serverId: string | undefined) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.channels(serverId!),
    queryFn: async (): Promise<Channel[]> => {
      try {
        const response = await getChannels(accessToken!, serverId!)
        return response as Channel[]
      } catch (error) {
        console.error("Error fetching channels:", error)
        throw new Error("Error fetching channels")
      }
    },
    enabled: !!accessToken && !!serverId,
  })
}

export const useCreateChannel = (serverId: string) => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: CreateServerChannelRequest) => {
      return createChannel(accessToken!, serverId, body)
    },
  })
}

export const useDeleteChannel = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (channelId: string) => {
      return deleteChannel(accessToken!, channelId)
    },
  })
}

export const useUpdateChannel = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (payload: { channelId: string; body: UpdateServerChannelRequest }) => {
      return updateChannel(accessToken!, payload.channelId, payload.body)
    },
  })
}

export const useFriendRequests = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ["friend-requests"],
    queryFn: async ({ pageParam }): Promise<GetFriendRequestsResponse> => {
      try {
        const response = await getFriendRequests(accessToken!, {
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
      if (lastPage.page * MAXIMUM_FRIEND_REQUESTS_PER_API_CALL < lastPage.total)
        return lastPage.page + 1
    },
    enabled: !!accessToken,
  })
}

export const useFriendInvitations = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ["friend-invitations"],
    queryFn: async ({ pageParam }): Promise<GetFriendInvitationsResponse> => {
      try {
        const response = await getFriendInvitations(accessToken!, {
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
      if (lastPage.page * MAXIMUM_FRIEND_INVITATIONS_PER_API_CALL < lastPage.total)
        return lastPage.page + 1
    },
    enabled: !!accessToken,
  })
}

export const useCreateFriendRequest = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: CreateFriendRequestRequest) => {
      return createFriendRequest(accessToken!, body)
    },
  })
}

export const useAcceptFriendRequest = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: AcceptFriendRequestRequest) => {
      return acceptFriendRequest(accessToken!, body)
    },
  })
}

export const useDeclineFriendRequest = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: DeclineFriendRequestRequest) => {
      return declineFriendRequest(accessToken!, body)
    },
  })
}

export const useDeleteFriendRequest = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: DeleteFriendRequestRequest) => {
      return deleteFriendRequest(accessToken!, body)
    },
  })
}

export const useFriends = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: async ({ pageParam }): Promise<GetFriendsResponse> => {
      try {
        const response = await getFriends(accessToken!, {
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
      if (lastPage.page * MAXIMUM_FRIEND_REQUESTS_PER_API_CALL < lastPage.total)
        return lastPage.page + 1
    },
    enabled: !!accessToken,
  })
}
