import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/Collapsible"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "./ui/Sidebar"
import { ChannelType, type Channel } from "./ServerChannels"
import TextChannel from "./TextChannel"
import VoiceChannel from "./VoiceChannel"

interface FolderProps {
  id: string
  name: string
  channels: Channel[]
}

export function Folder({ name, channels }: FolderProps) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="px-0">
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
                channel.type === ChannelType.TEXT ? (
                  <TextChannel key={channel.id} name={channel.name} isChildren={true} />
                ) : (
                  <VoiceChannel key={channel.id} name={channel.name} isChildren={true} />
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
