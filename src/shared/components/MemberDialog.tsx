import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { MessageSquare, UserPlus } from "lucide-react"
import { Button } from "./ui/Button"
import { useTranslation } from "react-i18next"
import { cn } from "../lib/utils"

export interface MemberData {
  id: string
  username: string
  avatar_url?: string
  status?: "online" | "offline" | "idle" | "dnd"
  description?: string
}

interface MemberDialogProps {
  member: MemberData
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors: Record<NonNullable<MemberData["status"]>, string> = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
}

export default function MemberDialog({ member, open, onOpenChange }: MemberDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xs">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {member.username} - {t("member.profile")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start justify-between gap-2 p-4">
          {/* Header with avatar and username */}
          <div className="relative">
            <Avatar className="size-16 rounded-md">
              <AvatarImage src={member.avatar_url} alt={member.username} />
              <AvatarFallback className="text-responsive-xl">
                {member.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "border-background absolute -right-1 -bottom-1 size-4 rounded-full border-4",
                statusColors[member.status ?? "offline"]
              )}
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <h3 className="text-responsive-lg font-bold">{member.username}</h3>
            <Button variant="outline" size="icon" className="shrink-0">
              <UserPlus className="size-4" />
              <span className="sr-only">{t("member.add_friend")}</span>
            </Button>
          </div>

          {/* Description */}
          {member.description && <p className="text-responsive-base">{member.description}</p>}

          {/* Message button */}
          <Button className="text-foreground mt-2 w-full font-semibold">
            <MessageSquare className="mr-2 size-4" />
            {t("member.send_message")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
