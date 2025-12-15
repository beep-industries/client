import { Hash } from "lucide-react"
import Channel from "./Channel"

interface TextChannelProps {
  name: string
  isChildren?: boolean
}

export default function TextChannel({ name, isChildren }: TextChannelProps) {
  return <Channel icon={Hash} name={name} isChildren={isChildren} />
}
