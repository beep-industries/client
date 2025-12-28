import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/Collapsible"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "./ui/Sidebar"
import TextChannel from "./TextChannel"
import VoiceChannel from "./VoiceChannel"
import { type Channel, ChannelTypes } from "@/shared/queries/community/community.types.ts"

interface FolderProps {
  id: string
  name: string
  channels: Channel[]
}

export function Folder({ name, channels }: FolderProps) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="p-0">
        <SidebarGroupLabel asChild className="px-0">
          <CollapsibleTrigger>
            {name}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {channels.map((channel) =>
                channel.channel_type === ChannelTypes.TEXT ? (
                  <TextChannel key={channel.id} channel={channel} isChildren={true} />
                ) : (
                  <VoiceChannel key={channel.id} channel={channel} isChildren={true} />
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
