import { createFileRoute } from "@tanstack/react-router"
import PageNotificationsFeature from "@/pages/notifications/feature/PageNotificationsFeature"

export const Route = createFileRoute("/notifications")({
  component: PageNotificationsFeature,
})
