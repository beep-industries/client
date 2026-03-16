export interface Role {
  id: string
  server_id: string
  name: string
  permissions: number
  created_at: string
  updated_at: string | null
}

export interface GetRolesResponse {
  data: Role[]
  page: number
  total: number
}
