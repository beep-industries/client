import { createFileRoute } from "@tanstack/react-router"
import PageServerSettings from "@/pages/server-settings/ui/PageServerSettings"

export const Route = createFileRoute("/servers/$id/settings")({
  component: ServerSettingsPage,
})

function ServerSettingsPage() {
  const { id } = Route.useParams()
  return <PageServerSettings id={id} />
}
