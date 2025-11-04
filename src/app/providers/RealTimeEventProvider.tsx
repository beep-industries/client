import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { Channel } from "phoenix"
import { useAuth } from "@/app/providers/AuthProvider"
import { useRealTimeSocket } from "./RealTimeSocketProvider"
import type { TopicName } from "@/shared/models/real-time.ts"

interface EventContextValue<S> {
  state: S | undefined
}

export interface RealTimeEventProviderProps<P = unknown, S = unknown> {
  children: React.ReactNode
  topic: TopicName
  event: string
  // Optional explicit id for nested access; defaults to `${resolvedTopic}:${event}`
  id?: string
  // Optional local state sink for this event
  state?: {
    initial: S
    reducer: (prev: S, msg: P, event: string) => S
  }
  // Optional side-effect handler invoked for every event message
  onEvent?: (payload: P, meta: { topic: string; channel: Channel; event: string }) => void
}

const EventContext = createContext<EventContextValue<unknown> | undefined>(undefined)

// Registry of all ancestor event states keyed by id, to support nested providers access
const EventRegistryContext = createContext<Map<string, unknown> | undefined>(undefined)

export function RealTimeEventProvider<P = unknown, S = unknown>({
  children,
  topic,
  event,
  id,
  state: stateCfg,
  onEvent,
}: RealTimeEventProviderProps<P, S>) {
  const { user, isAuthenticated } = useAuth()
  const { getChannel, connected } = useRealTimeSocket()

  const [state, setState] = useState<S | undefined>(stateCfg?.initial)
  const channelRef = useRef<Channel | null>(null)

  // Resolve topic string
  const topicName = useMemo(
    () => (typeof topic === "function" ? topic(user) : topic),
    [topic, user]
  )

  // Compute stable id for registry access
  const resolvedId = useMemo(() => id ?? `${topicName}:${event}`, [id, topicName, event])

  useEffect(() => {
    if (!isAuthenticated) return
    const ch = getChannel(topicName)
    if (!ch) return
    channelRef.current = ch

    const cb = (payload: unknown) => {
      if (stateCfg) {
        setState((prev) => stateCfg.reducer((prev ?? stateCfg.initial) as S, payload as P, event))
      }
      if (onEvent) onEvent(payload as P, { topic: topicName, channel: ch, event })
    }

    const id = ch.on(event, cb)

    return () => {
      try {
        ch.off(event, id)
      } catch {
        /* empty */
      }
    }
  }, [isAuthenticated, connected, getChannel, topicName, event, onEvent, stateCfg])

  const value = useMemo<EventContextValue<S>>(() => ({ state: state as S | undefined }), [state])

  // Merge into registry for nested access
  const parentRegistry = useContext(EventRegistryContext)
  const registry = useMemo(() => {
    const map = new Map(parentRegistry ?? undefined)
    map.set(resolvedId, state as unknown)
    return map
  }, [parentRegistry, resolvedId, state])

  return (
    <EventRegistryContext.Provider value={registry}>
      <EventContext.Provider value={value as EventContextValue<unknown>}>
        {children}
      </EventContext.Provider>
    </EventRegistryContext.Provider>
  )
}

export function useEventState<S = unknown>() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error("useEventState must be used within a RealTimeEventProvider")
  return ctx.state as S | undefined
}

// Access any ancestor event provider state by its id (defaults to `${topic}:${event}` when created)
export function useEventStateById<S = unknown>(id: string) {
  const registry = useContext(EventRegistryContext)
  if (!registry)
    throw new Error("useEventStateById must be used within a RealTimeEventProvider tree")
  return registry.get(id) as S | undefined
}

export function useEventRegistry() {
  return useContext(EventRegistryContext) ?? new Map<string, unknown>()
}
