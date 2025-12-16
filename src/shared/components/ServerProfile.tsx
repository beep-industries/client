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
import type { Server } from "../queries/community/community.types"

export function ServerProfile({ server }: { server: Server }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
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
            <DropdownMenuItem>
              <Plus className="size-4" />
              {t("serverProfile.create_channel")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Folder className="size-4" />
              {t("serverProfile.create_folder")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IdCard className="size-4" />
              {t("serverProfile.copy_server_id")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlus className="size-4" />
              {t("serverProfile.user_plus")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/servers/$id/settings"
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
    </SidebarMenu>
  )
}
