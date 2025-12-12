import { createFileRoute } from "@tanstack/react-router"
import PageExploreFeature from "@/pages/explore/feature/PageExploreFeature"

export const Route = createFileRoute("/explore")({
  component: PageExploreFeature,
})
