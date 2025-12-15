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
import { Button } from "./ui/Button"
import { useEffect } from "react"
import { useServers } from "../queries/community/community.queries"
import { useInView } from "react-intersection-observer"

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
          <Button variant="nav" size="icon-sm" aria-label={tooltip} className="cursor-pointer">
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
          <Button variant="nav" size="icon-sm" className="cursor-pointer bg-transparent">
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

  const { ref, inView } = useInView()

  const {
    data: servers,
    isError: serversError,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasPreviousPage,
    fetchNextPage,
  } = useServers()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Handle errors (Could be replaced with a toast notification)
  useEffect(() => {
    if (serversError) {
      alert(t("serverNav.error_loading_servers"))
    }
  }, [serversError, t])

  return (
    <nav className="bg-sidebar border-sidebar-border flex h-screen flex-col items-center gap-2 border-l p-2">
      <NavLinkButton to="/messages" icon={Inbox} tooltip={t("serverNav.messages")} />
      <NavLinkButton to="/explore" icon={Compass} tooltip={t("serverNav.explore")} />

      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="nav" size="icon-sm" className="cursor-pointer">
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
        <button
          onClick={() => fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetchingPreviousPage}
        ></button>
        {servers?.pages
          .flatMap((page) => page.data)
          .map((server) => (
            <ServerButton key={server.id} server={server} />
          ))}
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        ></button>
      </div>
    </nav>
  )
}
