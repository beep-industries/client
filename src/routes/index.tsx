import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  // Redirect to /discover as the main authenticated page
  return <Navigate to="/discover" />
}
