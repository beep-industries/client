import PageAudioChannel from "@/pages/channel/PageAudioChannel.tsx"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { useCallback, useEffect } from "react"
import { useParams } from "@tanstack/react-router"
import { useChannel } from "@/shared/queries/community/community.queries.ts"
import PageMessagesFeature from "@/pages/messages/feature/PageMessagesFeature.tsx"
import { useChannelType, type ChannelType } from "@/shared/components/ChannelTypeContext"

export default function ChannelPage() {
  const { channelId, id } = useParams({ strict: false }) as { channelId: string; id: string }
  const { join, iceStatus, session } = useWebRTC()
  const { data: channel } = useChannel(channelId)
  const { setChannelType } = useChannelType()

  const joinIn = useCallback(() => join(id, channelId), [join, id, channelId])

  useEffect(() => {
    setChannelType((channel?.channel_type as ChannelType) ?? null)
  }, [channel, setChannelType])

  useEffect(() => {
    if (
      channel?.channel_type === "ServerVoice" &&
      !(session === channelId && iceStatus === "connected")
    ) {
      joinIn()
    }
  }, [channel])

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
