import { PageServerProfileSettingsFeature } from "@/pages/server-settings/feature/PageServerProfileSettingsFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/profile/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageServerProfileSettingsFeature />
}
