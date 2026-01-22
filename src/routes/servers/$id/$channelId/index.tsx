import { createFileRoute } from "@tanstack/react-router"
import ChannelPage from "@/shared/components/ChannelPage.tsx"

export const Route = createFileRoute("/servers/$id/$channelId/")({
  component: ChannelIndexPage,
})

function ChannelIndexPage() {
  //const { id } = Route.useParams()
  return <ChannelPage />
}
