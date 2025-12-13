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
import type { Server } from "../queries/community/community.types"
import { MAXIMUM_SERVERS_PER_API_CALL } from "../constants/community.contants"
import { Button } from "./ui/Button"

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
          <Button variant="nav" size="icon-sm" aria-label={tooltip}>
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
}

function ServerButton({ server }: ServerButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to="/servers/$id" params={{ id: String(server.id) }}>
          <Button variant="nav" size="icon-sm" className="bg-transparent">
            <Avatar className="h-7 w-7 rounded-sm">
              <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
              <AvatarFallback className="text-sm">
                {server.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{server.name}</TooltipContent>
    </Tooltip>
  )
}

export default function ServerNav() {
  const { t } = useTranslation()

  const [servers, setServers] = useState<Server[]>([])
  const [page, setPage] = useState<number>(1)

  const { data: serversData, isError: serversError } = useServers(
    page,
    MAXIMUM_SERVERS_PER_API_CALL
  )

  // Format servers data when fetched
  useEffect(() => {
    if (serversData) {
      const data: GetServersResponse = serversData as GetServersResponse
      setServers((prevServers) => [...prevServers, ...data.data])
    }
  }, [serversData, page])

  // Handle errors (Could be replaced with a toast notification)
  useEffect(() => {
    if (serversError) {
      alert(t("serverNav.error_loading_servers"))
    }
  }, [serversError, t])

  const total = (serversData as GetServersResponse)?.total ?? 0

  const handleServerClick = (serverId: string) => {
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
        {servers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleServerClick(server.id)}
                className="border-border hover:border-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border bg-transparent transition-all duration-200"
              >
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
                  <AvatarFallback className="rounded-md text-sm">
                    {server.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{server.name}</TooltipContent>
          </Tooltip>
        ))}
        {page * MAXIMUM_SERVERS_PER_API_CALL < total && (
          <>
            <hr className="border-border" />
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="border-border hover:border-primary bg-border flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all duration-200"
            >
              <Plus className="text-muted-foreground h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
