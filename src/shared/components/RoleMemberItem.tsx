import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar"
import { Button } from "@/shared/components/ui/Button"
import { X } from "lucide-react"

interface RoleMemberItemProps {
  memberId: string
  username: string
  avatarUrl?: string
  onRemove: (memberId: string) => void
  disabled?: boolean
}

export function RoleMemberItem({
  memberId,
  username,
  avatarUrl,
  onRemove,
  disabled = false,
}: RoleMemberItemProps) {
  return (
    <div className="border-border hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="size-10 shrink-0 rounded-md">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback className="rounded-md">{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate font-medium">{username}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(memberId)}
        disabled={disabled}
        className="hover:bg-destructive hover:text-destructive-foreground shrink-0"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
