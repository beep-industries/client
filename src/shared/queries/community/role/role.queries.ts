import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { MAXIMUM_MEMBERS_PER_API_CALL } from "@/shared/constants/community.contants"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  assignRole,
  createRole,
  deleteRole,
  getRole,
  getRoleMembers,
  getRoles,
  getUserRolesInServer,
  unassignRole,
  updateRole,
} from "./role.api"
import type {
  AssignRoleRequest,
  CreateRoleRequest,
  UnassignRoleRequest,
  UpdateRoleRequest,
} from "./role.request"
import type { GetRolesResponse, Role } from "./role.response"
import type { GetServerMembersResponse } from "../member"

export const roleKeys = {
  all: ["role"] as const,
  roles: (serverId: string) => [...roleKeys.all, `roles-${serverId}`] as const,
  role: (roleId: string) => [...roleKeys.all, `role-${roleId}`] as const,
  roleMembers: (roleId: string) => [...roleKeys.all, `role-members-${roleId}`] as const,
  userRoles: (serverId: string) => [...roleKeys.all, `user-roles-${serverId}`] as const,
}

export const useRoles = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: roleKeys.roles(serverId),
    queryFn: async (): Promise<GetRolesResponse> => {
      try {
        const response = await getRoles(serverId)
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
    queryKey: roleKeys.role(roleId),
    queryFn: async (): Promise<Role> => {
      try {
        const response = await getRole(roleId)
        return response as Role
      } catch {
        throw new Error("Error fetching role")
      }
    },
    enabled: !!accessToken && !!roleId,
  })
}

export const useUserRolesInServer = (serverId: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: roleKeys.userRoles(serverId),
    queryFn: async (): Promise<Role[]> => {
      try {
        const response = await getUserRolesInServer(serverId)
        return response as Role[]
      } catch {
        throw new Error("Error fetching user roles")
      }
    },
    enabled: !!accessToken && !!serverId,
  })
}

export const useCreateRole = (serverId: string) => {
  return useMutation({
    mutationFn: (body: CreateRoleRequest) => createRole(serverId, body),
  })
}

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: (payload: { roleId: string; body: UpdateRoleRequest }) =>
      updateRole(payload.roleId, payload.body),
  })
}

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
  })
}

export const useAssignRole = () => {
  return useMutation({
    mutationFn: (body: AssignRoleRequest) => assignRole(body),
  })
}

export const useUnassignRole = () => {
  return useMutation({
    mutationFn: (body: UnassignRoleRequest) => unassignRole(body),
  })
}

export const useRoleMembers = (roleId: string) => {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: roleKeys.roleMembers(roleId),
    queryFn: async ({ pageParam }): Promise<GetServerMembersResponse> => {
      try {
        const response = await getRoleMembers(roleId, {
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
