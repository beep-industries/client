import { PageCreateRoleFeature } from "@/pages/server-settings/feature/PageCreateRoleFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/roles/new")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <PageCreateRoleFeature serverId={id} />
}
