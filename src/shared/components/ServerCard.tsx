import type { Server } from "@/shared/queries/community/community.types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"

interface ServerCardProps {
  server: Server
  onClick?: (server: Server) => void
}

export default function ServerCard({ server, onClick }: ServerCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(server)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-card group relative flex h-52 cursor-pointer flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Banner */}
      <div className="bg-muted relative h-28 w-full overflow-hidden">
        {server.banner_url ? (
          <img
            src={server.banner_url}
            alt={`${server.name} banner`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="bg-primary/20 h-full w-full" />
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col px-3 pb-3">
        {/* Avatar positioned at the bottom-left of the banner */}
        <Avatar className="border-card absolute -top-5 left-3 h-10 w-10 rounded-lg border-4">
          <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
          <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
            {server.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Server info */}
        <div className="mt-6 flex flex-col gap-0.5">
          <h4 className="text-foreground text-responsive-md truncate font-semibold">
            {server.name}
          </h4>
          {server.description && (
            <p className="text-muted-foreground text-responsive-sm line-clamp-2">
              {server.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
