export const ChannelTypes = {
  TEXT: "ServerText",
  VOICE: "ServerVoice",
  FOLDER: "ServerFolder",
  PRIVATE: "Private",
} as const

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
