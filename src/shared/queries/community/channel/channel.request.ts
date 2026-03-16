import type { ChannelType } from "./channel.types"

export interface CreateServerChannelRequest {
  name: string
  channel_type: ChannelType
  parent_id?: string | null
}

export interface UpdateServerChannelRequest {
  name: string
  parent_id: string | null
}
