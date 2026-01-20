import { Hash } from "lucide-react"
import Channel from "./Channel"
import type { Channel as ChannelType } from "@/shared/queries/community/community.types.ts"
import { useNavigate } from "@tanstack/react-router"

interface TextChannelProps {
  channel: ChannelType
  isChildren?: boolean
}

export default function TextChannel({ channel, isChildren }: TextChannelProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: `/servers/$id/$channelId`,
      params: { id: channel.server_id, channelId: channel.id },
    })
  }

  return <Channel icon={Hash} channel={channel} isChildren={isChildren} onClick={handleClick} />
}
