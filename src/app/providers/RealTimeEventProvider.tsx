import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { Channel } from "phoenix"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useRealTimeSocket } from "./RealTimeSocketProvider"
import type { EventContextValue, TopicName } from "@/shared/models/real-time.ts"

export interface RealTimeEventProviderProps<TPayload, TState> {
  children: React.ReactNode
  topic: TopicName
  event?: string // single event (legacy)
  events?: Array<{
    event: string
    onEvent?: (payload: unknown, meta: { topic: string; channel: Channel; event: string }) => void
  }>
  // Optional explicit id for nested access; defaults to `${resolvedTopic}:${event}`
  id?: string
  // Optional local state sink for this event
  state?: {
    initial: TState
    reducer: (prev: TState, msg: TPayload, event: string) => TState
  }
  // Optional side-effect handler invoked for every event message (legacy)
  onEvent?: (payload: TPayload, meta: { topic: string; channel: Channel; event: string }) => void
}

const EventContext = createContext<EventContextValue<unknown> | undefined>(undefined)

// Registry of all ancestor event states keyed by id, to support nested providers access
const EventRegistryContext = createContext<Map<string, unknown> | undefined>(undefined)

export function RealTimeEventProvider<P, S>({
  children,
  topic,
  event,
  events,
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

    // Support multiple events
    const eventList: Array<{
      event: string
      onEvent?: (payload: P, meta: { topic: string; channel: Channel; event: string }) => void
    }> =
      events && events.length > 0
        ? (events as Array<{
            event: string
            onEvent?: (payload: P, meta: { topic: string; channel: Channel; event: string }) => void
          }>)
        : event
          ? ([{ event, onEvent }] as Array<{
              event: string
              onEvent?: (
                payload: P,
                meta: { topic: string; channel: Channel; event: string }
              ) => void
            }>)
          : []

    const ids: Array<{ event: string; id: number | undefined }> = []

    eventList.forEach((entry) => {
      const { event: evt, onEvent: handler } = entry
      const cb = (payload: unknown) => {
        if (stateCfg) {
          setState((prev) => stateCfg.reducer(prev ?? stateCfg.initial, payload as P, evt))
        }
        if (handler) handler(payload as P, { topic: topicName, channel: ch, event: evt })
      }
      const id = ch.on(evt, cb)
      ids.push({ event: evt, id: id as number | undefined })
    })

    return () => {
      ids.forEach(({ event: evt, id }) => {
        try {
          ch.off(evt, id)
        } catch {
          /* empty */
        }
      })
    }
  }, [isAuthenticated, connected, getChannel, topicName, event, events, onEvent, stateCfg])

  const value = useMemo<EventContextValue<S>>(() => ({ state: state as S }), [state])

  // Merge into registry for nested access
  const parentRegistry = useContext(EventRegistryContext)
  const registry = useMemo(() => {
    const map = new Map(parentRegistry ?? undefined)
    map.set(resolvedId, state)
    return map
  }, [parentRegistry, resolvedId, state])

  return (
    <EventRegistryContext.Provider value={registry}>
      <EventContext.Provider value={value}>{children}</EventContext.Provider>
    </EventRegistryContext.Provider>
  )
}

export function useEventState<TState>() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error("useEventState must be used within a RealTimeEventProvider")
  return ctx.state as TState | undefined
}

// Access any ancestor event provider state by its id (defaults to `${topic}:${event}` when created)
export function useEventStateById<TState>(id: string) {
  const registry = useContext(EventRegistryContext)
  if (!registry)
    throw new Error("useEventStateById must be used within a RealTimeEventProvider tree")
  return registry.get(id) as TState | undefined
}

export function useEventRegistry() {
  return useContext(EventRegistryContext) ?? new Map<string, unknown>()
}
