import { useState } from "react"
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Folder,
  IdCard,
  Plus,
  Settings,
  UserPlus,
} from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import { type Server } from "../queries/community/community.types"
import { AddChannelForm } from "../forms/AddChannel"
import ServerInvitationDialog from "./ServerInvitationDialog"

export function ServerProfile({ server }: { server: Server }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [isFolder, setIsFolder] = useState(false)
  const { t } = useTranslation()
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState<boolean>(false)

  const handleCopyServerId = async () => {
    try {
      await navigator.clipboard.writeText(server.id)
      toast.success(t("serverProfile.server_id_copied"))
    } catch {
      toast.error(t("serverProfile.failed_to_copy"))
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
                  <AvatarFallback className="rounded-lg">
                    {server.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-responsive-md truncate font-medium">{server.name}</span>
                {isOpen ? (
                  <ChevronsDownUp className="ml-auto size-4" />
                ) : (
                  <ChevronsUpDown className="ml-auto size-4" />
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
                    <AvatarFallback className="rounded-lg">
                      {server.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="text-responsive-base truncate font-medium">{server.name}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setIsFolder(false)
                  setIsCreateChannelModalOpen(true)
                }}
              >
                <Plus className="size-4" />
                {t("serverProfile.create_channel")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setIsFolder(true)
                  setIsCreateChannelModalOpen(true)
                }}
              >
                <Folder className="size-4" />
                {t("serverProfile.create_folder")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  handleCopyServerId()
                }}
              >
                <IdCard className="size-4" />
                {t("serverProfile.copy_server_id")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setIsInvitationDialogOpen(true)
                }}
              >
                <UserPlus className="size-4" />
                {t("serverProfile.user_plus")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/servers/$id/settings/profile"
                  params={{ id: String(server.id) }}
                  className="text-responsive-base!"
                >
                  <Settings className="size-4" />
                  {t("serverProfile.settings")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
        <AddChannelForm
          serverId={String(server.id)}
          open={isCreateChannelModalOpen}
          isFolder={isFolder}
          onOpenChange={setIsCreateChannelModalOpen}
        />
      </SidebarMenu>
      <ServerInvitationDialog
        isOpen={isInvitationDialogOpen}
        onOpenChange={setIsInvitationDialogOpen}
        serverId={String(server.id)}
      />
    </>
  )
}
