import { createFileRoute } from "@tanstack/react-router"
import PageServerFeature from "@/pages/server/feature/PageServerFeature"

export const Route = createFileRoute("/servers/$id")({
  component: PageServerFeature,
})
