import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  createServer,
  deleteServer,
  getServerById,
  getServers,
  updateServer,
} from "./community.api"
import type { CreateServerRequest, GetServersResponse } from "./community.types"
import { MAXIMUM_SERVERS_PER_API_CALL } from "@/shared/constants/community.contants"

export const communityKeys = {
  all: [] as const,
  server: (serverId: string) => [...communityKeys.all, `server-${serverId}`],
}

export const useServerById = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.server(serverId),
    queryFn: () => getServerById(accessToken!, serverId),
    enabled: !!accessToken,
  })
}

/**
 * Custom hook that fetches servers with infinite scrolling capability.
 *
 * This hook uses React Query's `useInfiniteQuery` to manage paginated server data.
 * The `hasNextPage` property is automatically calculated by React Query based on the return value
 * of `getNextPageParam`. If `getNextPageParam` returns `undefined`, `hasNextPage` will be `false`.
 * Otherwise, if it returns a valid page number (lastPage.page + 1), `hasNextPage` will be `true`.
 *
 * @returns An infinite query result object containing:
 * - `data`: The paginated server data organized by pages
 * - `hasNextPage`: Boolean indicating if more pages are available (computed from `getNextPageParam`)
 * - `fetchNextPage`: Function to load the next page
 * - `isFetching`: Loading state indicator
 * - Other standard React Query infinite query properties
 *
 * @remarks
 * - The query is only enabled when an access token is available
 * - Each page fetches up to `MAXIMUM_SERVERS_PER_API_CALL` servers
 * - Errors during fetching are logged and re-thrown
 */
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
