import { useState } from "react"
import { ChevronsDownUp, ChevronsUpDown, Globe, LogOut, Moon, Settings, Sun } from "lucide-react"
import { Link, useRouteContext } from "@tanstack/react-router"
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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/Sidebar"
import { useTheme } from "@/app/providers/ThemeProvider"

export function UserNav({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { auth } = useRouteContext({ from: "__root__" })
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en"
    i18n.changeLanguage(newLang)
  }

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
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="text-responsive-base truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground text-responsive-sm truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme} className="text-responsive-base!">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {theme === "dark" ? t("userNav.light") : t("userNav.dark")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleLanguage} className="text-responsive-base!">
              <Globe className="size-4" />
              {i18n.language === "en" ? t("userNav.french") : t("userNav.english")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="text-responsive-base!">
                <Settings />
                {t("userNav.settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => auth.logout()} className="text-responsive-base!">
              <LogOut />
              {t("userNav.log_out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
