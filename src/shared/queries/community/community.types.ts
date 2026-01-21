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

export interface FriendRequest {
  user_id_invited: string
  user_id_requested: string
  status: 0 | 1
  created_at: string
}

export interface FriendInvitation {
  user_id_invited: string
  user_id_requested: string
  status: 0 | 1
  created_at: string
}

export interface Friend {
  user_id_1: string
  user_id_2: string
  created_at: string
}

// API call types

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

export interface GetFriendRequestsResponse {
  data: FriendRequest[]
  page: number
  total: number
}

export interface GetFriendInvitationsResponse {
  data: FriendInvitation[]
  page: number
  total: number
}

export interface CreateFriendRequestRequest {
  user_pseudo_invited: string
}

export interface AcceptFriendRequestRequest {
  user_id_requested: string
}

export interface DeclineFriendRequestRequest {
  user_id_requested: string
}

export interface DeleteFriendRequestRequest {
  user_id_invited: string
}

export interface GetFriendsResponse {
  data: Friend[]
  page: number
  total: number
}

export interface DeleteFriendRequest {
  friend_id: string
}

export interface CreateServerInvitation {
  server_id: string
  expire_in: ExpirationOption
}

export type ExpirationOption = "one_day" | "one_week" | "one_month"

export interface ExpirationPayload {
  expires_at: string
}

export const computeExpiration = (expiration: ExpirationOption): ExpirationPayload => {
  const now = new Date()

  switch (expiration) {
    case "one_day":
      now.setUTCDate(now.getUTCDate() + 1)
      break
    case "one_week":
      now.setUTCDate(now.getUTCDate() + 7)
      break
    case "one_month":
      now.setUTCMonth(now.getUTCMonth() + 1)
      break
  }

  return { expires_at: now.toISOString() }
}
