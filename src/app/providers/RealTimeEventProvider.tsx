import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import type { Channel } from "phoenix"

import { useRealTimeSocket } from "./RealTimeSocketProvider"
import type { EventContextValue } from "@/shared/models/real-time.ts"
import type { RealTimeEventProviderProps } from "./providers.types"

const EventContext = createContext<EventContextValue<unknown> | undefined>(undefined)

// Registry of all ancestor event states keyed by id, to support nested providers access
const EventRegistryContext = createContext<Map<string, unknown> | undefined>(undefined)

export function RealTimeEventProvider<P, S>({
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

    const cb = (payload: P) => {
      if (stateCfg) {
        setState((prev) => stateCfg.reducer(prev ?? stateCfg.initial, payload, event))
      }
      if (onEvent) onEvent(payload, { topic: topicName, channel: ch, event })
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
