import { useState } from "react"
import { useTranslation } from "react-i18next"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/ContextMenu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { MessageSquare, UserPlus, User } from "lucide-react"
import { Button } from "./ui/Button"

export interface MemberData {
  id: string
  username: string
  avatar_url?: string
  status?: "online" | "offline" | "idle" | "dnd"
  description?: string
}

interface MemberProps {
  member: MemberData
}

const statusColors: Record<NonNullable<MemberData["status"]>, string> = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
}

function StatusIndicator({ status }: { status?: MemberData["status"] }) {
  if (!status) return null
  return (
    <span
      className={`border-sidebar absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 ${statusColors[status]}`}
    />
  )
}

export default function Member({ member }: MemberProps) {
  const { t } = useTranslation()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowProfile(true)}>
              <div className="relative">
                <Avatar className="size-6 rounded-md">
                  <AvatarImage src={member.avatar_url} alt={member.username} />
                  <AvatarFallback className="text-responsive-sm">
                    {member.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <StatusIndicator status={member.status} />
              </div>
              <span className="truncate">{member.username}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowProfile(true)}>
            <User className="mr-2 size-4" />
            {t("member.view_profile")}
          </ContextMenuItem>
          <ContextMenuItem>
            <UserPlus className="mr-2 size-4" />
            {t("member.add_friend")}
          </ContextMenuItem>
          <ContextMenuItem>
            <MessageSquare className="mr-2 size-4" />
            {t("member.send_message")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xs">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("member.profile")}</DialogTitle>
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
                className={`border-background absolute -right-1 -bottom-1 size-4 rounded-full border-4 ${statusColors[member.status ?? "offline"]}`}
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
    </>
  )
}
