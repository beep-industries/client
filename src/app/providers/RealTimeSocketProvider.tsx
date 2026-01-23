import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { Channel, Socket } from "phoenix"
import { Socket as PhoenixSocket } from "phoenix"
import { Presence } from "phoenix"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import type { ChannelParams, RealTimeSocketState } from "@/shared/models/real-time.ts"

function buildSocketUrl(httpBase: string): string {
  const url = new URL(httpBase)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  const path = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname
  url.pathname = `${path}/socket`
  return url.toString()
}

export interface RealTimeSocketProviderProps {
  children: React.ReactNode
  httpBaseUrl?: string
}

const SocketContext = createContext<RealTimeSocketState | undefined>(undefined)

export function RealTimeSocketProvider({ children, httpBaseUrl }: RealTimeSocketProviderProps) {
  const { isAuthenticated, accessToken, user } = useAuth()
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const channelsRef = useRef<Map<string, Channel>>(new Map())
  const [presences, setPresences] = useState<
    Record<
      string,
      {
        metas: {
          phx_ref: string
          [key: string | number]: unknown
        }[]
      }[]
    >
  >({})
  const presenceRefs = useRef<Map<string, Presence>>(new Map())

  const backendHttpUrl = (httpBaseUrl ?? (import.meta.env.VITE_REAL_TIME_URL as string)) as string
  const socketUrl = useMemo(() => buildSocketUrl(backendHttpUrl), [backendHttpUrl])

  const join = useCallback((topic: string, params?: ChannelParams) => {
    const socket = socketRef.current
    if (!socket) throw new Error("Socket not initialized yet")
    const existing = channelsRef.current.get(topic)
    if (existing) return existing

    const channel = socket.channel(topic, params)
    channel
      .join()
      .receive("ok", () => {})
      .receive("error", (err) => {
        console.error(`[RealTimeSocket] Failed to join channel ${topic}`, err)
      })

    channelsRef.current.set(topic, channel)

    // Set up presence tracking
    if (!presenceRefs.current.has(topic)) {
      const presence = new Presence(channel)
      presence.onSync(() => {
        setPresences((prev) => ({ ...prev, [topic]: presence.list() }))
      })
      presenceRefs.current.set(topic, presence)
    }

    return channel
  }, [])
  // Connect / disconnect the socket based on auth state
  useEffect(() => {
    if (!socketRef.current || !socketRef.current.isConnected()) {
      const socket = new PhoenixSocket(socketUrl, {
        params: { token: accessToken },
        heartbeatIntervalMs: 30000,
        reconnectAfterMs: (tries: number) => Math.min(tries * 1000 + 1000, 10000),
      })
      socket.onOpen(() => setConnected(true))
      socket.onClose(() => setConnected(false))
      socket.onError(() => setConnected(false))
      socketRef.current = socket
    }

    const socket = socketRef.current!

    if (isAuthenticated) {
      socket.connect()
      const channel = join(`user:${user?.id}`)
      channel.on("token_expired", () => {
        channel.push("refresh_token", { token: accessToken })
      })
    } else {
      // Leave all channels and disconnect
      channelsRef.current.forEach((ch) => {
        try {
          ch.leave()
        } catch (err) {
          console.error("[RealTimeSocket] Error on channel leave", err)
        }
      })
      channelsRef.current.clear()
      presenceRefs.current.clear()
      setPresences({})
      socket.disconnect(() => void 0)
      setConnected(false)
    }
  }, [accessToken, isAuthenticated, join, socketUrl, user?.id])

  const leave = useCallback((topic: string) => {
    const ch = channelsRef.current.get(topic)
    if (ch) {
      try {
        ch.leave()
      } finally {
        channelsRef.current.delete(topic)
      }
    }
    // Clean up presence
    const presence = presenceRefs.current.get(topic)
    if (presence) {
      presenceRefs.current.delete(topic)
    }
    setPresences((prev) => {
      const newP = { ...prev }
      delete newP[topic]
      return newP
    })
  }, [])

  const getChannel = useCallback((topic: string) => channelsRef.current.get(topic), [])

  const value = useMemo<RealTimeSocketState>(
    () => ({ socket: socketRef.current, connected, join, leave, getChannel, presences }),
    [connected, join, leave, getChannel, presences]
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useRealTimeSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error("useRealTimeSocket must be used within a RealTimeSocketProvider")
  return ctx
}
