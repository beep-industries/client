import { Ellipsis } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"

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

export default function ServerNav() {
  const { t } = useTranslation()
  const handleServerClick = (serverId: number) => {
    console.log("Server clicked:", serverId)
  }

  return (
    <nav className="bg-sidebar border-sidebar-border flex h-screen flex-col items-center gap-2 border-l p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="border-border hover:border-primary bg-border flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200">
            <Ellipsis className="text-muted-foreground h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start" sideOffset={4}>
          <DropdownMenuItem className="text-responsive-base!">
            {t("serverNav.create_server")}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-responsive-base!">
            {t("serverNav.join_server")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent flex flex-1 flex-col gap-2 overflow-y-auto">
        {mockServers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleServerClick(server.id)}
                className="border-border hover:border-primary flex h-8 w-8 items-center justify-center rounded-md border bg-transparent transition-all duration-200"
              >
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarImage src={server.image ?? undefined} alt={server.name} />
                  <AvatarFallback className="rounded-md text-sm">
                    {server.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{server.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  )
}
