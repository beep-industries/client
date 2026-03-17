export interface ServerMember {
  id: string
  server_id: string
  user_id: string
  nickname: string | null
  joined_at: string
  updated_at: string | null
}

export interface GetServerMembersResponse {
  data: ServerMember[]
  page: number
  total: number
}
