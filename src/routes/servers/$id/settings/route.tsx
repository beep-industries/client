import { PageServerSettingsFeature } from "@/pages/server-settings/feature/PageServerSettingsFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { fullPath } = Route
  return <PageServerSettingsFeature id={id} origin={fullPath} />
}
