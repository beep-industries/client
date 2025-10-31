import { Button } from "@/shared/components/ui/button"
import { useLogoutMutation } from "@/shared/queries/auth/auth.queries"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useTopicState } from "@/app/providers/RealTimeChannelProvider.tsx"
import { useAuth } from "@/app/providers/AuthProvider.tsx"

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
      <DemoRandomEvents />
    </div>
  )
}

function DemoRandomEvents() {
  const events = useTopicState<undefined[]>("random") ?? []
  const messages = useTopicState<undefined[]>("message") ?? []

  return (
    <div className="flex w-full flex-row rounded border p-3">
      <div className="flex w-1/2 flex-col">
        <div className="mb-2 font-semibold">Realtime demo: last "random" events</div>
        {events.length === 0 ? (
          <div className="text-muted-foreground text-sm">No events yet.</div>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {events.map((e, idx) => (
              <li key={idx}>
                <code>{JSON.stringify(e)}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex w-1/2 flex-col">
        <div className="mb-2 font-semibold">Realtime demo: last "message" events</div>
        {messages.length === 0 ? (
          <div className="text-muted-foreground text-sm">No events yet.</div>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {messages.map((e, idx) => (
              <li key={idx}>
                <code>{JSON.stringify(e)}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
