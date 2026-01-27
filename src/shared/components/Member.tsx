import { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/ContextMenu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { UserPlus, User, Loader2 } from "lucide-react"
import { cn } from "../lib/utils"
import MemberDialog, { type MemberData } from "./MemberDialog"
import { communityKeys, useCreateFriendRequest } from "../queries/community/community.queries"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCurrentUser } from "../queries/user/user.queries"

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
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUser()
  const isCurrentUser = currentUser?.sub === member.id

  const {
    mutateAsync: createFriendRequest,
    isPending: isCreatingFriendRequest,
    error: createFriendRequestError,
    isSuccess: isCreateFriendRequestSuccess,
  } = useCreateFriendRequest()

  const handleError = useCallback(
    async (error: unknown, defaultMessage: string) => {
      if (error && typeof error === "object" && "response" in error) {
        const bodyData = await (error.response as Response).json()
        if (bodyData.error_code && bodyData.error_code.trim().length > 0) {
          toast.error(t("friendRequests.errors." + bodyData.error_code))
        } else if (bodyData.status === 404) {
          toast.error(t("topBar.modal.create_friend_request.errors_user_not_found"))
        } else {
          toast.error(defaultMessage)
        }
      } else {
        toast.error(defaultMessage)
      }
    },
    [t]
  )

  const handleAddFriend = () => {
    createFriendRequest({ user_pseudo_invited: member.username })
  }

  useEffect(() => {
    if (isCreateFriendRequestSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.friendRequests() })
      toast.success(t("topBar.modal.create_friend_request.success"))
    } else if (createFriendRequestError) {
      handleError(createFriendRequestError, t("topBar.modal.create_friend_request.error"))
    }
  }, [isCreateFriendRequestSuccess, createFriendRequestError, queryClient, t, handleError])

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
          {!isCurrentUser && (
            <ContextMenuItem onClick={handleAddFriend} disabled={isCreatingFriendRequest}>
              {isCreatingFriendRequest ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 size-4" />
              )}
              {t("member.add_friend")}
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <MemberDialog member={member} open={showProfile} onOpenChange={setShowProfile} />
    </>
  )
}
