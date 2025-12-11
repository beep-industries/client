import { createFileRoute } from "@tanstack/react-router"
import PageDiscoverFeature from "@/pages/discover/feature/page-discover-feature"

export const Route = createFileRoute("/discover")({
  component: PageDiscoverFeature,
})
