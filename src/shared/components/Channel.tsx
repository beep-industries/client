import { type LucideIcon } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./ui/ContextMenu"
import { foldersMock } from "./ServerChannels"

interface ChannelProps {
  icon: LucideIcon
  name: string
  isChildren?: boolean
}

export default function Channel({ icon: Icon, name, isChildren }: ChannelProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Icon />
            {name}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {isChildren && (
          <>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Move to folder</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                {foldersMock.map((folder) => (
                  <ContextMenuItem key={folder.id}>{folder.name}</ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuItem>Extract from folder</ContextMenuItem>
          </>
        )}
        <ContextMenuItem>Delete the channel</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
