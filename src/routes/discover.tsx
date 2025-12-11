import { createFileRoute } from "@tanstack/react-router"
import PageDiscoverFeature from "@/pages/discover/feature/PageDiscoverFeature"

export const Route = createFileRoute("/discover")({
  component: PageDiscoverFeature,
})
