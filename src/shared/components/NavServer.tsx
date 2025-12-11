import { Ellipsis } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip"

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

export default function NavServer() {
  const handleServerClick = (serverId: number) => {
    console.log("Server clicked:", serverId)
  }

  return (
    <nav className="bg-sidebar flex h-screen flex-col items-center gap-2 p-2">
      {/* Carré Messages Privés */}
      <button className="border-border hover:border-primary bg-border flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-200">
        <Ellipsis className="text-muted-foreground h-4 w-4" />
      </button>

      {/* Liste des serveurs */}
      <div className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent flex flex-1 flex-col gap-2 overflow-y-auto">
        {mockServers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleServerClick(server.id)}
                className="border-border hover:border-primary flex h-7 w-7 items-center justify-center rounded-md border bg-transparent transition-all duration-200"
              >
                {server.image ? (
                  <img
                    src={server.image}
                    alt={server.name}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm font-medium">
                    {server.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{server.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  )
}
