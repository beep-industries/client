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
import { useTranslation } from "react-i18next"

interface ChannelProps {
  icon: LucideIcon
  name: string
  isChildren?: boolean
}

export default function Channel({ icon: Icon, name, isChildren }: ChannelProps) {
  const { t } = useTranslation()

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
              <ContextMenuSubTrigger>{t("channel.move_to_folder")}</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                {foldersMock.map((folder) => (
                  <ContextMenuItem key={folder.id}>{folder.name}</ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuItem>{t("channel.extract_from_folder")}</ContextMenuItem>
          </>
        )}
        <ContextMenuItem>{t("channel.delete_channel")}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
