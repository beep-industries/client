import PageAudioChannel from "@/pages/channel/PageAudioChannel.tsx"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider.tsx"
import { useEffect } from "react"
import { useParams } from "@tanstack/react-router"
import { useChannel } from "@/shared/queries/community/community.queries.ts"
import PageMessagesFeature from "@/pages/messages/feature/PageMessagesFeature.tsx"
import { useChannelType, type ChannelType } from "@/shared/components/ChannelTypeContext"

export default function ChannelPage() {
  const { channelId, id } = useParams({ strict: false }) as { channelId: string; id: string }
  const { join, iceStatus, session } = useWebRTC()
  const { connected } = useRealTimeSocket()
  const { data: channel } = useChannel(channelId)
  const { setChannelType } = useChannelType()

  useEffect(() => {
    setChannelType((channel?.channel_type as ChannelType) ?? null)
    if (
      connected &&
      channel?.channel_type === "ServerVoice" &&
      session !== channelId &&
      iceStatus !== "connected"
    ) {
      join(id, channelId)
    }
  }, [channelId, id, join, connected, channel, setChannelType])

  return channel ? (
    channel?.channel_type === "ServerText" ? (
      <PageMessagesFeature channelId={channelId} serverId={id} />
    ) : (
      <PageAudioChannel />
    )
  ) : (
    <></>
  )
}
