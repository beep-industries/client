import { PageRolesSettingFeature } from "@/pages/server-settings/feature/PageRolesSettingFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/roles")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <PageRolesSettingFeature serverId={id} />
}
