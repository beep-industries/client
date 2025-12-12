import type { TopicName } from "@/shared/models/real-time"
import type { Channel } from "phoenix"
import type { User } from "@/shared/models/user"
import type { TopicJoinSpec } from "@/shared/models/real-time.ts"

interface RealTimeSocketProviderProps {
  children: React.ReactNode
  httpBaseUrl?: string
}

interface RealTimeEventProviderProps<TPayload, TState> {
  children: React.ReactNode
  topic: TopicName
  event: string
  // Optional explicit id for nested access; defaults to `${resolvedTopic}:${event}`
  id?: string
  // Optional local state sink for this event
  state?: {
    initial: TState
    reducer: (prev: TState, msg: TPayload, event: string) => TState
  }
  // Optional side-effect handler invoked for every event message
  onEvent?: (payload: TPayload, meta: { topic: string; channel: Channel; event: string }) => void
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  accessToken: string | null
  login: () => void
  logout: () => void
  error: Error | null
}

interface RealTimeTopicProviderProps {
  children: React.ReactNode
  topics?: TopicJoinSpec[]
}

interface PresenceDesc {
  id: number
  user_id: string
  video: boolean
  audio: boolean
}

interface RemoteState {
  id: number
  userId: string
  tracks: { audio: MediaStream | null; video: MediaStream | null }
  audio: boolean
  video: boolean
}

interface WebRTCState {
  // UI/status
  session: number | null
  iceStatus: RTCIceConnectionState
  channelStatus: string
  joined: boolean
  camEnabled: boolean
  micEnabled: boolean
  // Media
  remoteTracks: RemoteState[]
  // Actions
  join: (session: number) => Promise<void>
  leave: () => Promise<void>
  startCam: () => Promise<void>
  stopCam: () => void
  startMic: () => Promise<void>
  stopMic: () => void
}

export type {
  RealTimeSocketProviderProps,
  RealTimeEventProviderProps,
  AuthState,
  RealTimeTopicProviderProps,
  PresenceDesc,
  RemoteState,
  WebRTCState,
}
