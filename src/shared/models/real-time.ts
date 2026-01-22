import type { Channel, Socket } from "phoenix"

export type ChannelParams = Record<string, unknown>

export type TopicName = string | ((param: unknown) => string)

export interface RealTimeSocketState {
  socket: Socket | null
  connected: boolean
  join: (topic: string, params?: ChannelParams) => Channel
  leave: (topic: string) => void
  getChannel: (topic: string) => Channel | undefined
  presences: Record<
    string,
    {
      metas: [
        {
          phx_ref: string
          [key: string | number]: unknown
        },
      ]
    }[]
  >
}

export interface TopicJoinSpec {
  topic: TopicName
  params?: ChannelParams
  autoJoin?: boolean
}

export interface EventContextValue<TState> {
  state: TState
}
