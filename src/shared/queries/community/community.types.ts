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

export interface CreateServerRequest {
  name: string
  picture_url?: string
  banner_url?: string
  description?: string
  visibility: "Public" | "Private"
}

export interface UpdateServerRequest {
  name?: string
  picture_url?: string
  banner_url?: string
  description?: string
  visibility?: "Public" | "Private"
}

export const ChannelTypes = {
  TEXT: "ServerText",
  VOICE: "ServerVoice",
  FOLDER: "ServerFolder",
  PRIVATE: "Private",
}

export type ChannelType = (typeof ChannelTypes)[keyof typeof ChannelTypes]

export interface Channel {
  id: string
  name: string
  channel_type: ChannelType
  parent_id: string | null
  server_id: string
  created_at: string
  updated_at: string | null
}

export interface CreateServerChannelRequest {
  name: string
  channel_type: ChannelType
  parent_id?: string | null
}

export interface UpdateServerChannelRequest {
  name: string
  parent_id: string | null
}
