import type { Channel, Socket } from "phoenix"

export type ChannelParams = Record<string, unknown>

// Framework-style configuration to auto-initialize topics and route messages
export type TopicName = string | ((ctx: { user: unknown | null }) => string)

export interface TopicListener {
  event: string
  handler: (payload: unknown, meta: { topic: string; channel: Channel }) => void
}

export interface TopicStateSpec<TState = unknown> {
  // Initial state for this topic key
  initial: TState[]
  // Which events should be routed to the reducer
  events: string[]
  // Reducer that maps (prevState, msg, event) -> newState
  reducer: (prev: TState[], msg: TState, event: string) => TState[]
}

// New per-event configuration: allows reducer and/or handler per event
export interface EventToStateSpec<TState = unknown> {
  // Optional override key to store reduced state (defaults to TopicSpec.key)
  key?: string
  initial: TState[]
  reducer: (prev: TState[], msg: unknown, event: string) => TState[]
}

export interface EventSpec {
  event: string
  // When provided, this event will be reduced into provider state under the key
  toState?: EventToStateSpec<unknown>
  // Optional side-effect handler specific to this event
  handler?: (payload: unknown, meta: { topic: string; channel: Channel; event: string }) => void
}

export interface TopicSpec<TState = unknown> {
  // Unique key to read the routed state for this topic via useTopicState(key)
  key: string
  // Phoenix topic. Can be a string or a function that derives it from current auth user.
  topic: TopicName
  // Optional join params
  params?: ChannelParams
  // Auto-join and wire listeners when authenticated (default: true)
  autoJoin?: boolean
  // Optional state sink with reducer. When provided, specified events will update provider state
  // Deprecated in favor of per-event configs in `events`, but still supported for backward compatibility
  state?: TopicStateSpec<TState>
  // New: per-event configuration array
  events?: EventSpec[]
  // Optional side-effect listeners (topic-level)
  listeners?: TopicListener[]
}

export interface RealTimeSocketState {
  socket: Socket | null
  connected: boolean
  join: (topic: string, params?: ChannelParams) => Channel
  leave: (topic: string) => void
  getChannel: (topic: string) => Channel | undefined
}

export interface RealTimeChannelsState {
  // Routed state read-only snapshot keyed by TopicSpec.key (or custom keys if provided per-event)
  topicState: Record<string, unknown>
}

export interface RealTimeState extends RealTimeSocketState, RealTimeChannelsState {}
