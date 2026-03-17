import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { MAXIMUM_SERVERS_PER_API_CALL } from "@/shared/constants/community.contants"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptServerInvitation,
  createServer,
  createServerInvitation,
  deleteServer,
  getServerById,
  getServers,
  searchOrDiscoverServer,
  updateServer,
} from "./server.api"
import type {
  CreateServerInvitation,
  CreateServerRequest,
  UpdateServerRequest,
} from "./server.request"
import type { GetServersResponse, Server } from "./server.response"

export const serverKeys = {
  all: ["server"] as const,
  servers: () => [...serverKeys.all, "servers"] as const,
  server: (serverId: string) => [...serverKeys.all, `server-${serverId}`] as const,
  searchServers: (query: string) => [...serverKeys.all, "search-servers", query] as const,
  searchServersPage: (query: string, page: number) =>
    [...serverKeys.all, "search-servers", query, `page-${page}`] as const,
  discoverServers: () => [...serverKeys.all, "discover-servers"] as const,
  discoverServersPage: (page: number) =>
    [...serverKeys.all, "discover-servers", `page-${page}`] as const,
}

export const useCreateServer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateServerRequest) => createServer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.servers() })
      queryClient.invalidateQueries({ queryKey: serverKeys.discoverServers() })
      queryClient.invalidateQueries({ queryKey: [...serverKeys.all, "search-servers"] })
    },
  })
}

export const useServerById = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: serverKeys.server(serverId),
    queryFn: async (): Promise<Server> => {
      try {
        const response = await getServerById(serverId)

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
    queryKey: serverKeys.servers(),
    queryFn: async ({ pageParam }): Promise<GetServersResponse> => {
      try {
        const response = await getServers({
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

export const useUpdateServer = (serverId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateServerRequest) => updateServer(serverId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.server(serverId) })
      queryClient.invalidateQueries({ queryKey: serverKeys.servers() })
    },
  })
}

export const useDeleteServer = (serverId: string) => {
  return useMutation({
    mutationFn: () => deleteServer(serverId),
  })
}

export const useCreateServerInvitationMutation = () => {
  return useMutation({
    mutationFn: (body: CreateServerInvitation) => createServerInvitation(body),
  })
}

export const useAcceptServerInvitation = () => {
  return useMutation({
    mutationFn: (invitationId: string) => acceptServerInvitation(invitationId),
  })
}

export const useSearchServers = (searchQuery: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: serverKeys.searchServers(searchQuery),
    queryFn: async ({ pageParam }): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer(searchQuery, {
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
    queryKey: serverKeys.searchServersPage(searchQuery, page),
    queryFn: async (): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer(searchQuery, {
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
    queryKey: serverKeys.discoverServers(),
    queryFn: async ({ pageParam }): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer("", {
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
    queryKey: serverKeys.discoverServersPage(page),
    queryFn: async (): Promise<GetServersResponse> => {
      try {
        const response = await searchOrDiscoverServer("", {
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
