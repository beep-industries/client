import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useQuery } from "@tanstack/react-query"
import { getServers } from "./community.api"

export const communityKeys = {
  all: [] as const,
  servers: (page: number, limit: number) => [...communityKeys.all, `servers-${page}-${limit}`],
}

export const useServers = (page: number, limit: number) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: communityKeys.servers(page, limit),
    queryFn: () => getServers(accessToken!, { page, limit }),
    enabled: !!accessToken,
  })
}
