import { Compass, Ellipsis, Inbox, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { Button } from "./ui/Button"

interface Server {
  id: number
  name: string
  image: string | null
}

const mockServers: Server[] = [
  { id: 1, name: "General", image: null },
  { id: 2, name: "Gaming", image: null },
  { id: 3, name: "Music", image: null },
  { id: 4, name: "Development", image: null },
]

interface NavLinkButtonProps {
  to: string
  icon: LucideIcon
  tooltip: string
}

function NavLinkButton({ to, icon: Icon, tooltip }: NavLinkButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to}>
          <Button variant="nav" size="icon-sm">
            <Icon className="text-muted-foreground h-4 w-4" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

interface ServerButtonProps {
  server: Server
  onClick: () => void
}

function ServerButton({ server, onClick }: ServerButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="nav" size="icon-sm" onClick={onClick} className="bg-transparent">
          <Avatar className="h-7 w-7 rounded-sm">
            <AvatarImage src={server.image ?? undefined} alt={server.name} />
            <AvatarFallback className="text-sm">
              {server.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{server.name}</TooltipContent>
    </Tooltip>
  )
}

export default function ServerNav() {
  const { t } = useTranslation()

  const handleServerClick = (serverId: number) => {
    console.log("Server clicked:", serverId)
  }

  return (
    <nav className="bg-sidebar border-sidebar-border flex h-screen flex-col items-center gap-2 border-l p-2">
      <NavLinkButton to="/messages" icon={Inbox} tooltip={t("serverNav.messages")} />
      <NavLinkButton to="/explore" icon={Compass} tooltip={t("serverNav.explore")} />

      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="nav" size="icon-sm">
                <Ellipsis className="text-muted-foreground h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{t("serverNav.more_options")}</TooltipContent>
          <DropdownMenuContent side="left" align="start" sideOffset={4}>
            <DropdownMenuItem className="text-responsive-base!">
              {t("serverNav.create_server")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-responsive-base!">
              {t("serverNav.join_server")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>

      <div className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent flex flex-1 flex-col gap-2 overflow-y-auto">
        {mockServers.map((server) => (
          <ServerButton
            key={server.id}
            server={server}
            onClick={() => handleServerClick(server.id)}
          />
        ))}
      </div>
    </nav>
  )
}
