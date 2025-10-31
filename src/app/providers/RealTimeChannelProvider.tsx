import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/app/providers/AuthProvider"
import { useRealTimeSocket } from "./RealTimeSocketProvider"
import type { EventSpec, RealTimeChannelsState, TopicSpec } from "@/shared/models/real-time.ts"

interface ChannelProviderProps {
  children: React.ReactNode
  topics?: TopicSpec[]
}

const ChannelsContext = createContext<RealTimeChannelsState | undefined>(undefined)

export function RealTimeChannelProvider({ children, topics }: ChannelProviderProps) {
  const { isAuthenticated, user } = useAuth()
  const { join } = useRealTimeSocket()
  const [topicState, setTopicState] = useState<Record<string, unknown>>({})
  // Track listeners per concrete topic name
  const listenerRefs = useRef<Map<string, { event: string; cb: (payload: unknown) => void }[]>>(
    new Map()
  )

  // When auth is lost, clear state and listeners (channels are left by socket provider)
  useEffect(() => {
    if (!isAuthenticated) {
      // Attempt to detach any listeners from existing channels (if they still exist)
      // listenerRefs.current.forEach((entries) => {
      //   // we cannot access channels map here; off() will be skipped
      //   // cleanup list regardless
      // })
      listenerRefs.current.clear()
      setTopicState({})
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated || !topics || topics.length === 0) return

    const cleanups: (() => void)[] = []

    topics.forEach((spec) => {
      if (spec.autoJoin === false) return

      const topicName = typeof spec.topic === "function" ? spec.topic({ user }) : spec.topic
      const ch = join(topicName, spec.params)

      const registered: { event: string; cb: (payload: unknown) => void }[] = []

      // Determine effective events configuration (per-event preferred)
      let effectiveEvents: EventSpec[] = spec.events ?? []
      if ((!effectiveEvents || effectiveEvents.length === 0) && spec.state) {
        const legacy = spec.state
        effectiveEvents = legacy.events.map((ev) => ({
          event: ev,
          toState: {
            key: spec.key,
            initial: legacy.initial,
            reducer: legacy.reducer,
          },
        }))
      }

      if (spec.state && spec.events && spec.events.length > 0) {
        if (import.meta.env.NODE_ENV !== "production") {
          console.warn(
            "[RealTimeChannels] Both `state` and `events` provided. Using `events`.",
            spec
          )
        }
      }

      // Initialize state buckets for any toState entries
      effectiveEvents.forEach((e) => {
        if (e.toState) {
          const stateKey = e.toState.key ?? spec.key
          setTopicState((prev) =>
            prev[stateKey] === undefined ? { ...prev, [stateKey]: e.toState!.initial } : prev
          )
        }
      })

      // Wire per-event listeners
      effectiveEvents.forEach((e) => {
        const eventName = e.event
        const cb = (payload: unknown) => {
          if (e.toState) {
            const stateKey = e.toState.key ?? spec.key
            setTopicState((prev) => ({
              ...prev,
              [stateKey]: e.toState!.reducer(
                (prev[stateKey] ?? e.toState!.initial) as unknown,
                payload,
                eventName
              ),
            }))
          }
          if (e.handler) {
            e.handler(payload, { topic: topicName, channel: ch, event: eventName })
          }
        }
        ch.on(eventName, cb)
        registered.push({ event: eventName, cb })
      })

      // Topic-level side-effect listeners
      spec.listeners?.forEach(({ event, handler }) => {
        const cb = (payload: unknown) => handler(payload, { topic: topicName, channel: ch })
        ch.on(event, cb)
        registered.push({ event, cb })
      })

      // Save for later cleanup
      listenerRefs.current.set(topicName, registered)

      // Cleanup for this spec
      cleanups.push(() => {
        registered.forEach(({ event, cb }) => ch.off(event, cb))
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [isAuthenticated, topics, join, user])

  const value = useMemo<RealTimeChannelsState>(() => ({ topicState }), [topicState])
  return <ChannelsContext.Provider value={value}>{children}</ChannelsContext.Provider>
}

export function useRealTimeChannels() {
  const ctx = useContext(ChannelsContext)
  if (!ctx) throw new Error("useRealTimeChannels must be used within a RealTimeChannelProvider")
  return ctx
}

export function useTopicState<T = unknown>(key: string): T | undefined {
  const { topicState } = useRealTimeChannels()
  return topicState[key] as T | undefined
}
