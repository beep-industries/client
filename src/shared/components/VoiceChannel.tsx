import type { Channel as ChannelType } from "@/shared/queries/community/community.types.ts"
import { RealTimeTopicProvider } from "@/app/providers/RealTimeTopicProvider.tsx"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { Volume2 } from "lucide-react"
import Channel from "@/shared/components/Channel.tsx"
import { useMemo } from "react"

interface VoiceChannelProps {
  channel: ChannelType
  isChildren?: boolean
}

export default function VoiceChannel({ channel, isChildren }: VoiceChannelProps) {
  const { session, joined } = useWebRTC()
  const topic = useMemo(
    () => [{ topic: `voice-channel:${channel.id}`, params: { presence_only: true } }],
    [channel.id]
  )

  return joined && session === channel.id ? (
    <Channel icon={Volume2} channel={channel} isChildren={isChildren} />
  ) : (
    <RealTimeTopicProvider topics={topic}>
      <Channel icon={Volume2} channel={channel} isChildren={isChildren} />
    </RealTimeTopicProvider>
  )
}
