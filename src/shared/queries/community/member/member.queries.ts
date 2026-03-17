import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { MAXIMUM_MEMBERS_PER_API_CALL } from "@/shared/constants/community.contants"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { createMember, getServerMembers } from "./member.api"
import type { CreateMemberRequest } from "./member.request"
import type { GetServerMembersResponse } from "./member.response"

export const memberKeys = {
  all: ["member"] as const,
  members: (serverId: string) => [...memberKeys.all, `members-${serverId}`] as const,
  createMember: (serverId: string, userId: string) =>
    [...memberKeys.all, `members-${serverId}`, userId] as const,
}

export const useServerMembers = (serverId: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: memberKeys.members(serverId),
    queryFn: async ({ pageParam }): Promise<GetServerMembersResponse> => {
      try {
        const response = await getServerMembers(serverId, {
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
  return useMutation({
    mutationFn: (request: CreateMemberRequest) => createMember(request),
  })
}
