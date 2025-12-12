import { createFileRoute } from "@tanstack/react-router"
import PageMessagesFeature from "@/pages/messages/feature/PageMessagesFeature"

export const Route = createFileRoute("/messages")({
  component: PageMessagesFeature,
})
