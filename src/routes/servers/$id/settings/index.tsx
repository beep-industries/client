import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/")({
  component: ServerSettingsPage,
})

function ServerSettingsPage() {
  return <Outlet />
}
