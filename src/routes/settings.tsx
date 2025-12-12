import { createFileRoute } from "@tanstack/react-router"
import PageSettingsFeature from "@/pages/settings/feature/PageSettingsFeature"

export const Route = createFileRoute("/settings")({
  component: PageSettingsFeature,
})
