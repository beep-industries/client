import { createFileRoute } from "@tanstack/react-router"
import ChannelPage from "@/shared/components/ChannelPage.tsx"
import { useEffect } from "react"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"

export const Route = createFileRoute("/servers/$id/$channelId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { channelId } = Route.useParams()
  const { join } = useWebRTC()

  useEffect(() => {
    console.log("joining channel", channelId)
    join(channelId)
  }, [channelId, join])

  return <ChannelPage />
}
