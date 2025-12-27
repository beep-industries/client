import { Hash } from "lucide-react"
import Channel from "./Channel"
import type { Channel as ChannelType } from "@/shared/queries/community/community.types.ts"

interface TextChannelProps {
  channel: ChannelType
  isChildren?: boolean
}

export default function TextChannel({ channel, isChildren }: TextChannelProps) {
  return <Channel icon={Hash} channel={channel} isChildren={isChildren} />
}
