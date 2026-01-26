import { createFileRoute } from "@tanstack/react-router"
import { PageRoleMembersSettingsFeature } from "@/pages/server-settings/feature/PageRoleMembersSettingsFeature"
import { useRole } from "@/shared/queries/community/community.queries"

export const Route = createFileRoute("/servers/$id/settings/roles/$roleId/members")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id, roleId } = Route.useParams()
  const { data: role, isLoading, isError } = useRole(roleId)

  return (
    <PageRoleMembersSettingsFeature
      serverId={id}
      roleId={roleId}
      role={role}
      isLoadingRole={isLoading}
      isErrorRole={isError}
    />
  )
}
