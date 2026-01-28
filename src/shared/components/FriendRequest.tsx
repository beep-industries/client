import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { useUserBySub } from "../queries/user/user.queries"
import { Button } from "./ui/Button"
import {
  communityKeys,
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useDeleteFriend,
  useDeleteFriendRequest,
} from "../queries/community/community.queries"
import { useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

interface FriendRequestProps {
  user_id: string
  status?: 0 | 1
  type: "sent" | "received" | "default"
}

export default function FriendRequest({ user_id, status, type }: FriendRequestProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data } = useUserBySub(user_id)

  const {
    mutateAsync: acceptFriendRequest,
    isSuccess: isAcceptFriendRequestSuccess,
    error: acceptFriendRequestError,
  } = useAcceptFriendRequest()
  const {
    mutateAsync: declineFriendRequest,
    isSuccess: isDeclineFriendRequestSuccess,
    error: declineFriendRequestError,
  } = useDeclineFriendRequest()
  const {
    mutateAsync: deleteFriendRequest,
    isSuccess: isDeleteFriendRequestSuccess,
    error: deleteFriendRequestError,
  } = useDeleteFriendRequest()
  const {
    mutateAsync: deleteFriend,
    isSuccess: isDeleteFriendSuccess,
    error: deleteFriendError,
  } = useDeleteFriend()

  const handleError = useCallback(
    async (error: unknown, defaultMessage: string) => {
      if (error && typeof error === "object" && "response" in error) {
        const bodyData = await (error.response as Response).json()
        if (bodyData.error_code && bodyData.error_code.trim().length > 0) {
          toast.error(t("friendRequests.errors." + bodyData.error_code))
        } else {
          toast.error(defaultMessage)
        }
      } else {
        toast.error(defaultMessage)
      }
    },
    [t]
  )

  useEffect(() => {
    if (isAcceptFriendRequestSuccess) {
      toast.success(t("friendRequests.accept_success"))
      queryClient.invalidateQueries({ queryKey: communityKeys.friendInvitations() })
      queryClient.invalidateQueries({ queryKey: communityKeys.friends() })
    }
    if (acceptFriendRequestError) {
      handleError(acceptFriendRequestError, t("friendRequests.accept_error"))
    }
  }, [isAcceptFriendRequestSuccess, queryClient, acceptFriendRequestError, t, handleError])

  useEffect(() => {
    if (isDeclineFriendRequestSuccess) {
      toast.success(t("friendRequests.decline_success"))
      queryClient.invalidateQueries({ queryKey: communityKeys.friendInvitations() })
    }
    if (declineFriendRequestError) {
      handleError(declineFriendRequestError, t("friendRequests.decline_error"))
    }
  }, [isDeclineFriendRequestSuccess, declineFriendRequestError, queryClient, t, handleError])

  useEffect(() => {
    if (isDeleteFriendRequestSuccess) {
      toast.success(t("friendRequests.delete_request_success"))
      queryClient.invalidateQueries({ queryKey: communityKeys.friendRequests() })
    }
    if (deleteFriendRequestError) {
      handleError(deleteFriendRequestError, t("friendRequests.delete_request_error"))
    }
  }, [isDeleteFriendRequestSuccess, deleteFriendRequestError, queryClient, t, handleError])

  useEffect(() => {
    if (isDeleteFriendSuccess) {
      toast.success(t("friendRequests.delete_friend_success"))
      queryClient.invalidateQueries({ queryKey: communityKeys.friends() })
    }
    if (deleteFriendError) {
      handleError(deleteFriendError, t("friendRequests.delete_friend_error"))
    }
  }, [isDeleteFriendSuccess, deleteFriendError, queryClient, t, handleError])

  return (
    <div className="group hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full flex-row items-center justify-between rounded-md p-2">
      <div className="flex flex-row items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg">
          <AvatarImage
            src={data?.profile_picture}
            alt={data?.display_name || t("friendRequests.default_user_name")}
          />
          <AvatarFallback className="rounded-lg">
            {data?.display_name.charAt(0).toUpperCase() ||
              t("friendRequests.default_user_name").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="truncate text-sm font-bold">
            {data?.display_name || t("friendRequests.default_user_name")}
          </p>
          <p className="text-muted-foreground truncate text-sm font-medium">{data?.description}</p>
        </div>
      </div>
      {type === "received" ? (
        <div className="hidden flex-row gap-2 group-hover:flex">
          <Button
            variant="outline"
            onClick={() => acceptFriendRequest({ user_id_requested: user_id })}
          >
            {t("friendRequests.accept")}
          </Button>
          <Button
            variant="outline"
            onClick={() => declineFriendRequest({ user_id_requested: user_id })}
          >
            {t("friendRequests.decline")}
          </Button>
        </div>
      ) : type == "sent" ? (
        status === 0 ? (
          <div className="hidden flex-row gap-2 group-hover:flex">
            <Button
              variant="outline"
              onClick={() => deleteFriendRequest({ user_id_invited: user_id })}
            >
              {t("friendRequests.delete")}
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{t("friendRequests.refused")}</p>
        )
      ) : (
        <div className="hidden flex-row gap-2 group-hover:flex">
          <Button variant="outline" onClick={() => deleteFriend(user_id)}>
            {t("friendRequests.delete")}
          </Button>
        </div>
      )}
    </div>
  )
}
