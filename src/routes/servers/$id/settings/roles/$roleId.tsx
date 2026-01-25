import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/roles/$roleId")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/servers/$id/settings/roles/$roleId"!</div>
}
