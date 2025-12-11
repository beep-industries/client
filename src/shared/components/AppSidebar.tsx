import { Bell, Compass, Inbox, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "./ui/Sidebar"
import { UserMediaControls } from "./UserMediaControls"
import { UserNav } from "./UserNav"
import { cn } from "@/shared/lib/utils"

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: "Messages", icon: Inbox, href: "/messages" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Explore", icon: Compass, href: "/discover" },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <UserNav
          user={{
            name: "rapidement",
            email: "dodo@gmail.com",
            avatar: "",
          }}
        />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {item.label}
              </Link>
            )
          })}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <UserMediaControls channelName={"Hey"} />
      </SidebarFooter>
    </Sidebar>
  )
}
