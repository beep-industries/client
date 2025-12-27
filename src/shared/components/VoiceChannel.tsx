import { Volume2 } from "lucide-react"
import Channel from "./Channel"
import type { Channel as ChannelType } from "@/shared/queries/community/community.types.ts"

interface VoiceChannelProps {
  channel: ChannelType
  isChildren?: boolean
}

export default function VoiceChannel({ channel, isChildren }: VoiceChannelProps) {
  return <Channel icon={Volume2} channel={channel} isChildren={isChildren} />
}
