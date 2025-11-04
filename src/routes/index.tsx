import { Button } from "@/shared/components/ui/button"
import { useLogoutMutation } from "@/shared/queries/auth/auth.queries"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/app/providers/AuthProvider.tsx"
import { RealTimeEventProvider, useEventStateById } from "@/app/providers/RealTimeEventProvider.tsx"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { mutate: logout, isSuccess: logoutSuccess } = useLogoutMutation()
  const { user } = useAuth()

  useEffect(() => {
    if (logoutSuccess) location.reload()
  }, [logoutSuccess])

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        Hello "/"! {user?.firstName} with id {user?.id}
      </div>
      <Button onClick={() => logout()}>{t("common.logout")}</Button>
      <DemoNestedEvents />
    </div>
  )
}

// Example showing nested RealTimeEventProvider instances with explicit payload/state types
function DemoNestedEvents() {
  // Define payload types for strong typing
  type MessagePayload = { id: string; text: string }
  type RandomPayload = { x: number }
  const { user } = useAuth()

  return (
    <div className="flex w-full flex-col gap-3 rounded border p-3">
      {/* Outer provider listens to "message" events and keeps last 10 messages */}
      <RealTimeEventProvider<MessagePayload, MessagePayload[]>
        topic={`user:${user?.id}`}
        event="random"
        id="outer:message"
        state={{ initial: [], reducer: (prev, msg) => [msg, ...prev].slice(0, 10) }}
      >
        {/* Inner provider listens to "random" and keeps a simple count of received events */}
        <RealTimeEventProvider<RandomPayload, number>
          topic={`user:${user?.id}`}
          event="random"
          id="inner:random"
          state={{
            initial: 0,
            reducer: (prev) => {
              return prev + 1
            },
          }}
        >
          <NestedPanel outerId="outer:message" />
        </RealTimeEventProvider>
      </RealTimeEventProvider>
    </div>
  )
}

function NestedPanel({ outerId }: { outerId: string }) {
  // Read inner provider's local state (random event count)
  const randomCount = useEventStateById<number>("inner:random") ?? 0
  // Read outer provider's state by id (last 10 messages)
  const messages =
    useEventStateById<
      { id: number; type: string; body: { message: string }; occurred_at: string }[]
    >(outerId) ?? []

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="font-semibold">Nested providers demo</div>
      <div className="text-muted-foreground text-sm">
        Random events received (inner state): {randomCount}
      </div>
      <div className="text-sm font-semibold">Last messages (outer state):</div>
      {messages.length === 0 ? (
        <div className="text-muted-foreground text-sm">No messages yet.</div>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {messages.map((m) => (
            <li key={m.id}>
              <code>{m.body.message}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
