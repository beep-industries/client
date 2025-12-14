import { Bell, Compass, Inbox, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
} from "./ui/Sidebar"
import { UserMediaControls } from "./UserMediaControls"
import { UserNav } from "./UserNav"
import { cn } from "@/shared/lib/utils"
import { useCurrentUser } from "@/shared/queries/user/user.queries"
import type { UserFullInfo } from "@/shared/queries/user/user.types"

interface NavItem {
  labelKey: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { labelKey: "sidebar.messages", icon: Inbox, href: "/messages" },
  { labelKey: "sidebar.notifications", icon: Bell, href: "/notifications" },
  { labelKey: "sidebar.explore", icon: Compass, href: "/explore" },
]

export function AppSidebar() {
  const location = useLocation()
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser(true) as { data: UserFullInfo | undefined }

  return (
    <Sidebar>
      <SidebarHeader>
        <UserNav
          user={{
            name: currentUser?.display_name || currentUser?.username || "",
            email: currentUser?.email ?? "",
            avatar: currentUser?.profile_picture ?? "",
          }}
        />
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup className="p-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-responsive-base! flex w-full items-center justify-start gap-3 rounded-md px-4 py-2 font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {t(item.labelKey)}
              </Link>
            )
          })}
        </SidebarGroup>
        <SidebarSeparator className="my-3" />
      </SidebarContent>
      <SidebarFooter>
        <UserMediaControls channelName={"Hey"} />
      </SidebarFooter>
    </Sidebar>
  )
}
