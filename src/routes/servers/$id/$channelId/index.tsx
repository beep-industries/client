import PageMessagesFeature from "@/pages/messages/feature/PageMessagesFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/$channelId/")({
  component: ChannelIndexPage,
})

function ChannelIndexPage() {
  //const { id } = Route.useParams()
  return <PageMessagesFeature />
}
