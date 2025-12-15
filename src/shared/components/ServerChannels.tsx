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

export const ChannelType = {
  TEXT: "text",
  VOICE: "voice",
} as const

export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType]

export interface Channel {
  id: string
  name: string
  type: ChannelType
  folderId: string | null
}

interface Folder {
  id: string
  name: string
}

const foldersMock: Folder[] = [
  { id: "1", name: "Information" },
  { id: "2", name: "Text Channels" },
  { id: "3", name: "Voice Channels" },
  { id: "4", name: "Gaming" },
]

const channelsMock: Channel[] = [
  // Channels without folder (rendered at top)
  { id: "1", name: "bienvenue", type: ChannelType.TEXT, folderId: null },
  { id: "2", name: "règles", type: ChannelType.TEXT, folderId: null },
  // Information folder
  { id: "3", name: "annonces", type: ChannelType.TEXT, folderId: "1" },
  { id: "4", name: "événements", type: ChannelType.TEXT, folderId: "1" },
  // Text Channels folder
  { id: "5", name: "général", type: ChannelType.TEXT, folderId: "2" },
  { id: "6", name: "memes", type: ChannelType.TEXT, folderId: "2" },
  { id: "7", name: "aide", type: ChannelType.TEXT, folderId: "2" },
  // Voice Channels folder
  { id: "8", name: "général", type: ChannelType.VOICE, folderId: "3" },
  { id: "9", name: "musique", type: ChannelType.VOICE, folderId: "3" },
  { id: "10", name: "afk", type: ChannelType.VOICE, folderId: "3" },
  // Gaming folder
  { id: "11", name: "minecraft", type: ChannelType.TEXT, folderId: "4" },
  { id: "12", name: "valorant", type: ChannelType.TEXT, folderId: "4" },
  { id: "13", name: "gaming-vocal", type: ChannelType.VOICE, folderId: "4" },
]

export default function ServerChannels() {
  const { t } = useTranslation()
  const channelsWithoutFolder = channelsMock.filter((c) => c.folderId === null)

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full px-0">
        <ContextMenu>
          <ContextMenuTrigger>
            {/* Channels without folder */}
            {channelsWithoutFolder.length > 0 && (
              <SidebarMenu>
                {channelsWithoutFolder.map((channel) =>
                  channel.type === ChannelType.TEXT ? (
                    <TextChannel key={channel.id} name={channel.name} isChildren={false} />
                  ) : (
                    <VoiceChannel key={channel.id} name={channel.name} />
                  )
                )}
              </SidebarMenu>
            )}
            {/* Folders with their channels */}
            {foldersMock.map((folder) => (
              <FolderComponent
                key={folder.id}
                id={folder.id}
                name={folder.name}
                channels={channelsMock.filter((c) => c.folderId === folder.id)}
              />
            ))}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>{t("serverChannels.create_channel")}</ContextMenuItem>
            <ContextMenuItem>{t("serverChannels.delete_folder")}</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>{t("serverChannels.create_channel")}</ContextMenuItem>
        <ContextMenuItem>{t("serverChannels.create_folder")}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
