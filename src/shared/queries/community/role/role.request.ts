export interface CreateRoleRequest {
  name: string
  permissions: number
}

export interface UpdateRoleRequest {
  name?: string
  permissions?: number
}

export interface AssignRoleRequest {
  role_id: string
  member_id: string
}

export interface UnassignRoleRequest {
  role_id: string
  member_id: string
}
