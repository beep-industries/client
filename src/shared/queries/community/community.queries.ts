import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  createServer,
  deleteServer,
  getServerById,
  getServers,
  updateServer,
} from "./community.api"
import type { CreateServerRequest, GetServersResponse, Server } from "./community.types"
import { MAXIMUM_SERVERS_PER_API_CALL } from "@/shared/constants/community.contants"

export const communityKeys = {
  all: [] as const,
  server: (serverId: string) => [...communityKeys.all, `server-${serverId}`],
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
