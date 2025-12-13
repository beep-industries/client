import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useQuery } from "@tanstack/react-query"
import {
  createServer,
  deleteServer,
  getServerById,
  getServers,
  updateServer,
} from "./community.api"
import type { CreateServerRequest } from "./community.types"

export const communityKeys = {
  all: [] as const,
  server: (serverId: string) => [...communityKeys.all, `server-${serverId}`],
  servers: (page: number, limit: number) => [...communityKeys.all, `servers-${page}-${limit}`],
}

export const useServerById = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.server(serverId),
    queryFn: () => getServerById(accessToken!, serverId),
    enabled: !!accessToken,
  })
}

export const useServers = (page: number, limit: number) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.servers(page, limit),
    queryFn: () => getServers(accessToken!, { page, limit }),
    enabled: !!accessToken,
  })
}

export const useCreateServer = () => {
  const { accessToken } = useAuth()

  return {
    mutate: (body: CreateServerRequest) => {
      return createServer(accessToken!, body)
    },
    isLoading: !!accessToken,
  }
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
