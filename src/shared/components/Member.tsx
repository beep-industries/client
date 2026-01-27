import { useState } from "react"
import { useTranslation } from "react-i18next"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/ContextMenu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { UserPlus, User } from "lucide-react"
import { cn } from "../lib/utils"
import MemberDialog, { type MemberData } from "./MemberDialog"

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
      className={cn(
        "border-sidebar absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2",
        statusColors[status]
      )}
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
        </ContextMenuContent>
      </ContextMenu>

      <MemberDialog member={member} open={showProfile} onOpenChange={setShowProfile} />
    </>
  )
}
