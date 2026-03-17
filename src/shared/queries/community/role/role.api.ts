import { api } from ".."
import type { CommunityPagination } from "../common"
import type {
  AssignRoleRequest,
  CreateRoleRequest,
  UnassignRoleRequest,
  UpdateRoleRequest,
} from "./role.request"

export const getRoles = (serverId: string) => {
  return api.requester.get(`servers/${serverId}/roles`).json()
}

export const getRole = (roleId: string) => {
  return api.requester.get(`roles/${roleId}`).json()
}

export const createRole = (serverId: string, body: CreateRoleRequest) => {
  return api.requester.post(`servers/${serverId}/roles`, { json: body }).json()
}

export const updateRole = (roleId: string, body: UpdateRoleRequest) => {
  return api.requester.put(`roles/${roleId}`, { json: body }).json()
}

export const deleteRole = (roleId: string) => {
  return api.requester.delete(`roles/${roleId}`).json()
}

export const assignRole = ({ role_id, member_id }: AssignRoleRequest) => {
  return api.requester.post(`roles/${role_id}/members/${member_id}`).json()
}

export const unassignRole = ({ role_id, member_id }: UnassignRoleRequest) => {
  return api.requester.delete(`roles/${role_id}/members/${member_id}`).json()
}

export const getRoleMembers = (roleId: string, query: CommunityPagination) => {
  const searchParams = {
    page: query.page.toString(),
    limit: query.limit.toString(),
  }
  return api.requester.get(`roles/${roleId}/members`, { searchParams }).json()
}

export const getUserRolesInServer = (serverId: string) => {
  return api.requester.get(`servers/${serverId}/roles/@me`).json()
}
