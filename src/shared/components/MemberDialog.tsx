import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { Loader2, UserPlus } from "lucide-react"
import { Button } from "./ui/Button"
import { useTranslation } from "react-i18next"
import { cn } from "../lib/utils"
import { communityKeys, useCreateFriendRequest } from "../queries/community/community.queries"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useEffect, useCallback } from "react"
import { useCurrentUser } from "../queries/user/user.queries"

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
            {member.id && !isCurrentUser && (
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={handleAddFriend}
                disabled={isCreatingFriendRequest}
              >
                {isCreatingFriendRequest ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                <span className="sr-only">{t("member.add_friend")}</span>
              </Button>
            )}
          </div>

          {/* Description */}
          {member.description && <p className="text-responsive-base">{member.description}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
