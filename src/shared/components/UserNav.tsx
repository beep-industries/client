import { useState } from "react"
import {
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  Globe,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react"
import { Link, useRouteContext } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import { useTheme } from "@/app/providers/ThemeProvider"
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/Tooltip"
import { UserSettingsDialog } from "./user-settings/UserSettingsDialog"
import { Dialog } from "./ui/Dialog"

export function UserNav({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { auth } = useRouteContext({ from: "__root__" })
  const [isOpen, setIsOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-responsive-md truncate font-medium">{user.name}</span>
                {isOpen ? (
                  <ChevronsDownUp className="ml-auto size-4" />
                ) : (
                  <ChevronsUpDown className="ml-auto size-4" />
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="top"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                  <UserSettingsDialog user={user}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar
                          className="hover:outline-primary h-8 w-8 cursor-pointer rounded-lg duration-100 ease-in-out hover:outline hover:outline-2 hover:outline-offset-2"
                          onClick={() => {
                            setIsDialogOpen(true)
                          }}
                        >
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="rounded-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("userNav.change_picture")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </UserSettingsDialog>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="text-responsive-base truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground text-responsive-sm truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-responsive-base!">
                  {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  {t("userNav.theme")}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="text-responsive-base!"
                    >
                      {t("userNav.light")}
                      {theme === "light" && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="text-responsive-base!"
                    >
                      {t("userNav.dark")}
                      {theme === "dark" && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-responsive-base!">
                  <Globe className="size-4" />
                  {t("userNav.language")}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => i18n.changeLanguage("en")}
                      className="text-responsive-base!"
                    >
                      {t("userNav.english")}
                      {i18n.language === "en" && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => i18n.changeLanguage("fr")}
                      className="text-responsive-base!"
                    >
                      {t("userNav.french")}
                      {i18n.language === "fr" && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="text-responsive-base!">
                  <Settings className="size-4" />
                  {t("userNav.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => auth.logout()} className="text-responsive-base!">
                <LogOut className="size-4" />
                {t("userNav.log_out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
