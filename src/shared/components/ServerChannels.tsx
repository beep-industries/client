import { Folder as FolderComponent } from "./Folder"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/ContextMenu"
import { SidebarMenu } from "./ui/Sidebar"
import TextChannel from "./TextChannel"
import VoiceChannel from "./VoiceChannel"
import { useTranslation } from "react-i18next"
import {
  communityKeys,
  useChannels,
  useDeleteChannel,
} from "@/shared/queries/community/community.queries"
import { ChannelTypes } from "@/shared/queries/community/community.types.ts"
import { AddChannelForm } from "@/shared/forms/AddChannel.tsx"
import { useEffect, useState } from "react"
import { useFolder } from "@/shared/hooks/UseFolder.ts"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export interface Folder {
  id: string
  name: string
}

interface ServerChannelsProps {
  serverId: string
}

export default function ServerChannels({ serverId }: ServerChannelsProps) {
  const { t } = useTranslation()
  const { setFolders, folders } = useFolder()

  const {
    mutateAsync: deleteChannel,
    isError: isDeleteChannelError,
    isSuccess: isDeleteChannelSuccess,
  } = useDeleteChannel()
  const queryClient = useQueryClient()

  const { data: channelsData = [] } = useChannels(serverId)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [isFolder, setIsFolder] = useState(false)
  const [parentId, setParentId] = useState<string | undefined>(undefined)

  const channelsWithoutFolder = channelsData.filter(
    (c) => c.parent_id === null && c.channel_type !== ChannelTypes.FOLDER
  )

  useEffect(() => {
    if (isDeleteChannelSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.channels(serverId) })
      toast.success(t("serverChannels.success_deleting_channel"))
    } else if (isDeleteChannelError) {
      toast.error(t("serverChannels.error_deleting_channel"))
    }
  }, [isDeleteChannelError, isDeleteChannelSuccess, t, queryClient, serverId])

  useEffect(() => {
    const newFolders = channelsData
      .filter((c) => c.channel_type === ChannelTypes.FOLDER)
      .map((channel) => {
        return { id: channel.id, name: channel.name } as Folder
      })
    console.log("new folders", newFolders, folders)
    if (
      (folders.length !== newFolders.length || folders.every((val) => newFolders.includes(val))) &&
      (folders.length > 0 || newFolders.length > 0)
    ) {
      console.log("folders changed", folders, newFolders)
      setFolders(newFolders)
    }
  }, [channelsData, setFolders, folders])

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-full flex-col gap-2">
        {/* Channels without folder */}
        {channelsWithoutFolder.length > 0 && (
          <SidebarMenu className="gap-2">
            {channelsWithoutFolder.map((channel) =>
              channel.channel_type === ChannelTypes.TEXT ? (
                <TextChannel key={channel.id} channel={channel} isChildren={false} />
              ) : (
                <VoiceChannel key={channel.id} channel={channel} />
              )
            )}
          </SidebarMenu>
        )}
        {/* Folders with their channels */}
        {folders.map((folder) => (
          <ContextMenu key={folder.id}>
            <ContextMenuTrigger>
              <FolderComponent
                id={folder.id}
                name={folder.name}
                channels={channelsData.filter((c) => c.parent_id === folder.id)}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  setParentId(folder.id)
                  setIsFolder(false)
                  setIsCreateChannelModalOpen(true)
                }}
              >
                {t("serverChannels.create_channel")}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  deleteChannel(folder.id)
                }}
              >
                {t("serverChannels.delete_folder")}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setIsFolder(false)
            setIsCreateChannelModalOpen(true)
          }}
        >
          {t("serverChannels.create_channel")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setIsFolder(true)
            setIsCreateChannelModalOpen(true)
          }}
        >
          {t("serverChannels.create_folder")}
        </ContextMenuItem>
      </ContextMenuContent>
      <AddChannelForm
        serverId={serverId}
        open={isCreateChannelModalOpen}
        parentId={parentId}
        setParentId={setParentId}
        isFolder={isFolder}
        setIsFolder={setIsFolder}
        onOpenChange={setIsCreateChannelModalOpen}
      />
    </ContextMenu>
  )
}
