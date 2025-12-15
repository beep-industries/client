import { Volume2 } from "lucide-react"
import Channel from "./Channel"

interface VoiceChannelProps {
  name: string
  isChildren?: boolean
}

export default function VoiceChannel({ name, isChildren }: VoiceChannelProps) {
  return <Channel icon={Volume2} name={name} isChildren={isChildren} />
}
