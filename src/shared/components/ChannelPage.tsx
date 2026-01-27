import PageAudioChannel from "@/pages/channel/PageAudioChannel.tsx"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider.tsx"
import { useEffect } from "react"
import { useParams } from "@tanstack/react-router"
import { useChannel } from "@/shared/queries/community/community.queries.ts"
import PageMessagesFeature from "@/pages/messages/feature/PageMessagesFeature.tsx"

export default function ChannelPage() {
  const { channelId, id } = useParams({ strict: false }) as { channelId: string; id: string }
  const { join } = useWebRTC()
  const { connected } = useRealTimeSocket()
  const { data: channel } = useChannel(channelId)

  useEffect(() => {
    if (connected && channel?.channel_type === "ServerVoice") {
      join(id, channelId)
    }
  }, [channelId, id, join, connected, channel])

  return channel?.channel_type === "ServerText" ? (
    <PageMessagesFeature channelId={channelId} serverId={id} />
  ) : (
    <PageAudioChannel />
  )
}
