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
import { useEffect, useMemo, useState } from "react"
import { useFolder } from "@/shared/hooks/UseFolder.ts"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { RealTimeTopicProvider } from "@/app/providers/RealTimeTopicProvider.tsx"
import type { TopicJoinSpec } from "@/shared/models/real-time.ts"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"

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
  const { session, joined } = useWebRTC()

  const {
    mutateAsync: deleteFolder,
    isError: isDeleteFolderError,
    isSuccess: isDeleteFolderSuccess,
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
    if (isDeleteFolderSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.channels(serverId) })
      toast.success(t("serverChannels.success_deleting_folder"))
    } else if (isDeleteFolderError) {
      toast.error(t("serverChannels.error_deleting_folder"))
    }
  }, [t, queryClient, serverId, isDeleteFolderSuccess, isDeleteFolderError])

  useEffect(() => {
    const newFolders = channelsData
      .filter((c) => c.channel_type === ChannelTypes.FOLDER)
      .map((channel) => {
        return { id: channel.id, name: channel.name } as Folder
      })
    if (
      (folders.length !== newFolders.length || folders.every((val) => newFolders.includes(val))) &&
      (folders.length > 0 || newFolders.length > 0)
    ) {
      setFolders(newFolders)
    }
  }, [channelsData, setFolders, folders])

  const watchedTopicSpecs: TopicJoinSpec[] = useMemo(() => {
    const result: TopicJoinSpec[] = []
    channelsWithoutFolder.forEach((channel) => {
      if (channel.channel_type === ChannelTypes.TEXT) {
        result.push({ topic: `text-channel:${channel.id}` })
      } else {
        if (!(joined && session === channel.id)) {
          result.push({ topic: `voice-channel:${channel.id}`, params: { presence_only: true } })
        }
      }
    })
    return result
  }, [channelsWithoutFolder, joined, session])

  return (
    <RealTimeTopicProvider topics={watchedTopicSpecs}>
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
                    deleteFolder(folder.id)
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
          onOpenChange={setIsCreateChannelModalOpen}
        />
      </ContextMenu>
    </RealTimeTopicProvider>
  )
}
