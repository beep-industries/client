import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  // Redirect to /explore as the main authenticated page
  return <Navigate to="/explore" />
}
