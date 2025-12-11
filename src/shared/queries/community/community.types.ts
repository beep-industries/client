export interface Server {
  id: string
  name: string
  banner_url: string | null
  picture_url: string | null
  description: string | null
  owner_id: string
  visibility: "Public" | "Private"

  created_at: string
  updated_at: string | null
}

export interface CommunityPagination {
  page: number
  limit: number
}

export interface GetServersResponse {
  data: Server[]
  page: number
  total: number
}
