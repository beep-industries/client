import React, { useEffect } from "react"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { useRealTimeSocket } from "./RealTimeSocketProvider"
import type { TopicJoinSpec } from "@/shared/models/real-time.ts"

export interface RealTimeTopicProviderProps {
  children: React.ReactNode
  topics?: TopicJoinSpec[]
}

export function RealTimeTopicProvider({ children, topics }: RealTimeTopicProviderProps) {
  const { isAuthenticated, user } = useAuth()
  const { join, connected, leave } = useRealTimeSocket()

  useEffect(() => {
    if (!isAuthenticated || !topics || topics.length === 0 || !connected) return

    const cleanups: (() => void)[] = []

    topics.forEach((spec) => {
      if (spec.autoJoin === false) return
      const topicName = typeof spec.topic === "function" ? spec.topic(user) : spec.topic
      const ch = join(topicName, spec.params)
      // caller can use useRealTimeSocket().getChannel(topic) to access
      cleanups.push(() => {
        try {
          leave(ch.topic)
        } catch {
          /* empty */
        }
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [isAuthenticated, topics, join, user, connected, leave])

  return <>{children}</>
}
