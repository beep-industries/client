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
  getChannel,
  deleteFriend,
  createServerInvitation,
  acceptServerInvitation,
  getServerMembers,
  searchOrDiscoverServer,
  createMember,
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
  unassignRole,
  getRoleMembers,
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
  CreateServerInvitation,
  GetServerMembersResponse,
  CreateMemberRequest,
  Role,
  GetRolesResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignRoleRequest,
  UnassignRoleRequest,
} from "./community.types"
import {
  MAXIMUM_FRIEND_INVITATIONS_PER_API_CALL,
  MAXIMUM_FRIEND_REQUESTS_PER_API_CALL,
  MAXIMUM_FRIENDS_PER_API_CALL,
  MAXIMUM_SERVERS_PER_API_CALL,
  MAXIMUM_MEMBERS_PER_API_CALL,
} from "@/shared/constants/community.contants"

export const communityKeys = {
  all: [] as const,
  servers: () => [...communityKeys.all, "servers"] as const,
  server: (serverId: string) => [...communityKeys.all, `server-${serverId}`] as const,
  channels: (serverId: string) => [...communityKeys.all, `channels-${serverId}`] as const,
  members: (serverId: string) => [...communityKeys.all, `members-${serverId}`] as const,
  createMember: (servirId: string, userId: string) =>
    [...communityKeys.all, `members-${servirId}`, userId] as const,
  roles: (serverId: string) => [...communityKeys.all, `roles-${serverId}`] as const,
  role: (roleId: string) => [...communityKeys.all, `role-${roleId}`] as const,
  roleMembers: (roleId: string) => [...communityKeys.all, `role-members-${roleId}`] as const,
  friends: () => [...communityKeys.all, "friends"] as const,
  friendRequests: () => [...communityKeys.all, "friend-requests"] as const,
  friendInvitations: () => [...communityKeys.all, "friend-invitations"] as const,
  searchServers: (query: string) => [...communityKeys.all, "search-servers", query] as const,
  searchServersPage: (query: string, page: number) =>
    [...communityKeys.all, "search-servers", query, `page-${page}`] as const,
  discoverServers: () => [...communityKeys.all, "discover-servers"] as const,
  discoverServersPage: (page: number) =>
    [...communityKeys.all, "discover-servers", `page-${page}`] as const,
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
    enabled: !!accessToken && !!serverId,
  })
}

export const useServers = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: communityKeys.servers(),
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

export const useChannel = (channelId: string) => {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: communityKeys.channels(channelId),
    queryFn: async (): Promise<Channel> => {
      try {
        const response = await getChannel(accessToken!, channelId)
        return response as Channel
      } catch (error) {
        console.error("Error fetching channel by ID:", error)
        throw new Error("Error fetching channel by ID")
      }
    },
    enabled: !!accessToken && !!channelId,
  })
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
    queryKey: communityKeys.friendRequests(),
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
    queryKey: communityKeys.friendInvitations(),
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
    queryKey: communityKeys.friends(),
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
      if (lastPage.page * MAXIMUM_FRIENDS_PER_API_CALL < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken,
  })
}

export const useDeleteFriend = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (friend_id: string) => {
      return deleteFriend(accessToken!, { friend_id })
    },
  })
}

export const useCreateServerInvitationMutation = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: CreateServerInvitation) => createServerInvitation(accessToken!, body),
  })
}

export const useAcceptServerInvitation = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (invitationId: string) => acceptServerInvitation(accessToken!, invitationId),
  })
}

export const useServerMembers = (serverId: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: communityKeys.members(serverId),
    queryFn: async ({ pageParam }): Promise<GetServerMembersResponse> => {
      try {
        const response = await getServerMembers(accessToken!, serverId, {
          page: pageParam,
          limit: MAXIMUM_MEMBERS_PER_API_CALL,
        })

        return response as GetServerMembersResponse
      } catch (error) {
        console.error("Error fetching server members:", error)
        throw new Error("Error fetching server members")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_MEMBERS_PER_API_CALL < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken && !!serverId,
  })
}

export const useCreateMember = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (request: CreateMemberRequest) => {
      return createMember(accessToken!, request)
    },
  })
}

export const useSearchServers = (searchQuery: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: communityKeys.searchServers(searchQuery),
    queryFn: async ({ pageParam }): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer(accessToken!, searchQuery, {
          page: pageParam,
          limit: MAXIMUM_SERVERS_PER_API_CALL,
        })

        return response as GetServersResponse
      } catch (error) {
        console.error("Error searching servers:", error)
        throw new Error("Error searching servers")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_SERVERS_PER_API_CALL < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken && searchQuery.length > 0,
  })
}

export const useSearchServersPage = (searchQuery: string, page: number) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.searchServersPage(searchQuery, page),
    queryFn: async (): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer(accessToken!, searchQuery, {
          page,
          limit: MAXIMUM_SERVERS_PER_API_CALL,
        })

        return response as GetServersResponse
      } catch (error) {
        console.error("Error searching servers:", error)
        throw new Error("Error searching servers")
      }
    },
    enabled: !!accessToken && searchQuery.length > 0,
  })
}

export const useDiscoverServers = () => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: communityKeys.discoverServers(),
    queryFn: async ({ pageParam }): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer(accessToken!, "", {
          page: pageParam,
          limit: MAXIMUM_SERVERS_PER_API_CALL,
        })

        return response as GetServersResponse
      } catch (error) {
        console.error("Error discovering servers:", error)
        throw new Error("Error discovering servers")
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

export const useDiscoverServersPage = (page: number) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.discoverServersPage(page),
    queryFn: async (): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer(accessToken!, "", {
          page,
          limit: MAXIMUM_SERVERS_PER_API_CALL,
        })

        return response as GetServersResponse
      } catch (error) {
        console.error("Error discovering servers:", error)
        throw new Error("Error discovering servers")
      }
    },
    enabled: !!accessToken,
  })
}
export const useRoles = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.roles(serverId),
    queryFn: async (): Promise<GetRolesResponse> => {
      try {
        const response = await getRoles(accessToken!, serverId)
        return response as GetRolesResponse
      } catch (error) {
        console.error("Error fetching roles:", error)
        throw new Error("Error fetching roles")
      }
    },
    enabled: !!accessToken && !!serverId,
  })
}

export const useRole = (roleId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.role(roleId),
    queryFn: async (): Promise<Role> => {
      try {
        const response = await getRole(accessToken!, roleId)
        return response as Role
      } catch (error) {
        console.error("Error fetching role:", error)
        throw new Error("Error fetching role")
      }
    },
    enabled: !!accessToken && !!roleId,
  })
}

export const useCreateRole = (serverId: string) => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: CreateRoleRequest) => {
      console.log("useCreateRole mutation called with:", body)
      console.log("accessToken:", accessToken ? "exists" : "missing")
      console.log("serverId:", serverId)
      return createRole(accessToken!, serverId, body)
    },
  })
}

export const useUpdateRole = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (payload: { roleId: string; body: UpdateRoleRequest }) => {
      return updateRole(accessToken!, payload.roleId, payload.body)
    },
  })
}

export const useDeleteRole = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (roleId: string) => {
      return deleteRole(accessToken!, roleId)
    },
  })
}

export const useAssignRole = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: AssignRoleRequest) => {
      return assignRole(accessToken!, body)
    },
  })
}

export const useUnassignRole = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (body: UnassignRoleRequest) => {
      return unassignRole(accessToken!, body)
    },
  })
}

export const useRoleMembers = (roleId: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: communityKeys.roleMembers(roleId),
    queryFn: async ({ pageParam }): Promise<GetServerMembersResponse> => {
      try {
        const response = await getRoleMembers(accessToken!, roleId, {
          page: pageParam,
          limit: MAXIMUM_MEMBERS_PER_API_CALL,
        })

        return response as GetServerMembersResponse
      } catch (error) {
        console.error("Error fetching role members:", error)
        throw new Error("Error fetching role members")
      }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * MAXIMUM_MEMBERS_PER_API_CALL < lastPage.total) return lastPage.page + 1
    },
    enabled: !!accessToken && !!roleId,
  })
}
