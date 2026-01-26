import { PageRolePermissionsSettingsFeature } from "@/pages/server-settings/feature/PageRolePermissionsSettingsFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/roles/$roleId/permissions")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id, roleId } = Route.useParams()
  return <PageRolePermissionsSettingsFeature serverId={id} roleId={roleId} />
}
