import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"

interface FriendProps {
  id: string
  name: string
  avatar: string
}

export default function Friend({ id, name, avatar }: FriendProps) {
  return (
    <Link
      to="/messages/$id"
      params={{ id }}
      className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full flex-row items-center gap-3 rounded-md p-2"
      activeProps={{
        className:
          "flex w-full flex-row items-center gap-3 rounded-md p-2 bg-sidebar-accent text-sidebar-accent-foreground",
      }}
    >
      <Avatar className="h-7 w-7 rounded-lg grayscale">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="rounded-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-responsive-base truncate font-medium">{name}</span>
    </Link>
  )
}
