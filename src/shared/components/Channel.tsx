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
import { useTranslation } from "react-i18next"
import { useFolder } from "@/shared/hooks/UseFolder.ts"
import {
  communityKeys,
  useDeleteChannel,
  useUpdateChannel,
} from "@/shared/queries/community/community.queries.ts"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import type { Channel } from "@/shared/queries/community/community.types.ts"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { cn } from "@/shared/lib/utils"

interface ChannelProps {
  icon: LucideIcon
  channel: Channel
  isChildren?: boolean
  onClick?: () => void
  isSelected?: boolean
}

export default function Channel({
  icon: Icon,
  channel,
  isChildren,
  onClick,
  isSelected = false,
}: ChannelProps) {
  const { t } = useTranslation()
  const { folders } = useFolder()
  const {
    mutateAsync: deleteChannel,
    isError: isDeleteChannelError,
    isSuccess: isDeleteChannelSuccess,
  } = useDeleteChannel()
  const { channelId } = useParams({ strict: false }) as { channelId?: string }
  const { join } = useWebRTC()

  const navigate = useNavigate()

  const {
    mutateAsync: updateChannel,
    isError: isUpdateChannelError,
    isSuccess: isUpdateChannelSuccess,
  } = useUpdateChannel()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isDeleteChannelSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.channels(channel.server_id) })
      toast.success(t("serverChannels.success_deleting_channel"))
    } else if (isDeleteChannelError) {
      toast.error(t("serverChannels.error_deleting_channel"))
    }
  }, [isDeleteChannelError, isDeleteChannelSuccess, t, queryClient, channel])

  useEffect(() => {
    if (isUpdateChannelSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.channels(channel.server_id) })
      toast.success(t("serverChannels.success_moving_channel"))
    } else if (isUpdateChannelError) {
      toast.error(t("serverChannels.error_moving_channel"))
    }
  }, [channel.server_id, isUpdateChannelError, isUpdateChannelSuccess, queryClient, t])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() =>
              channelId === channel.id
                ? join(channel.server_id, channel.id)
                : navigate({ to: `/servers/${channel.server_id}/${channel.id}` })
            }
            className="w-full cursor-pointer"
            size="lg"
            aria-label={channel.name}
          >
            <Icon />
            {channel.name}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {folders.filter((folder) => folder.id !== channel.parent_id).length > 0 && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>{t("channel.move_to_folder")}</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              {folders
                .filter((folder) => folder.id !== channel.parent_id)
                .map((folder) => (
                  <ContextMenuItem
                    key={folder.id}
                    onClick={(e) => {
                      e.preventDefault()
                      updateChannel({
                        channelId: channel.id,
                        body: { name: channel.name, parent_id: folder.id },
                      })
                    }}
                  >
                    {folder.name}
                  </ContextMenuItem>
                ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}
        {isChildren && (
          <ContextMenuItem
            onClick={(e) => {
              e.preventDefault()
              updateChannel({
                channelId: channel.id,
                body: { name: channel.name, parent_id: null },
              })
            }}
          >
            {t("channel.extract_from_folder")}
          </ContextMenuItem>
        )}
        <ContextMenuItem
          onClick={(e) => {
            e.preventDefault()
            deleteChannel(channel.id)
          }}
        >
          {t("channel.delete_channel")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
