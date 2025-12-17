import { createFileRoute } from "@tanstack/react-router"
import PageSettingsFeature from "@/pages/user-settings/feature/PageSettingsFeature"

export const Route = createFileRoute("/settings")({
  component: PageSettingsFeature,
})
