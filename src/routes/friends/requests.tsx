import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useDeleteFriendRequest,
  useFriendInvitations,
  useFriendRequests,
} from "@/shared/queries/community/community.queries"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Avatar, AvatarImage } from "./../../shared/components/ui/Avatar"
import { Check, Trash2, X } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/friends/requests")({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: friendInvitations } = useFriendInvitations()
  const { data: friendRequests } = useFriendRequests()
  const {
    mutateAsync: acceptFriendRequest,
    isError: isAcceptFriendRequestError,
    isSuccess: isAcceptFriendRequestSuccess,
  } = useAcceptFriendRequest()
  const {
    mutateAsync: declineFriendRequest,
    isError: isDeclineFriendRequestError,
    isSuccess: isDeclineFriendRequestSuccess,
  } = useDeclineFriendRequest()
  const {
    mutateAsync: deleteFriendRequest,
    isError: isDeleteFriendRequestError,
    isSuccess: isDeleteFriendRequestSuccess,
  } = useDeleteFriendRequest()

  useEffect(() => {
    if (isDeleteFriendRequestSuccess) {
      toast.success(t("friendRequests.delete_request_success"))
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] })
    }
    if (isDeleteFriendRequestError) {
      toast.error(t("friendRequests.delete_request_error"))
    }
  }, [isDeleteFriendRequestSuccess, isDeleteFriendRequestError, queryClient, t])

  useEffect(() => {
    if (isAcceptFriendRequestSuccess) {
      toast.success(t("friendRequests.accept_success"))
      queryClient.invalidateQueries({ queryKey: ["friend-invitations"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    }
    if (isAcceptFriendRequestError) {
      toast.error(t("friendRequests.accept_error"))
    }
  }, [isAcceptFriendRequestSuccess, isAcceptFriendRequestError, queryClient, t])

  useEffect(() => {
    if (isDeclineFriendRequestSuccess) {
      toast.success(t("friendRequests.decline_success"))
      queryClient.invalidateQueries({ queryKey: ["friend-invitations"] })
    }
    if (isDeclineFriendRequestError) {
      toast.error(t("friendRequests.decline_error"))
    }
  }, [isDeclineFriendRequestSuccess, isDeclineFriendRequestError, queryClient, t])

  return (
    <div className="flex flex-col gap-4 p-2">
      <div>
        <h1 className="mb-4 text-xl font-bold">{t("friendRequests.invitations_received")}</h1>
        {friendInvitations?.pages[0]?.data.map((request) => (
          <div
            key={request.user_id_requested}
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-2">
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarImage
                    src="https://beep-image.baptistebronsin.be/logo.png"
                    alt="user avatar"
                  />
                </Avatar>
                <p>{request.user_id_requested}</p>
              </div>
              <p className="text-muted-foreground">
                {t("friendRequests.received_at", {
                  date: new Date(request.created_at).toLocaleDateString(),
                  time: new Date(request.created_at).toLocaleTimeString(),
                })}
              </p>
            </div>
            {request.status === 1 ? (
              <p className="text-muted-foreground">{t("friendRequests.refused")}</p>
            ) : (
              <div className="flex flex-row gap-4">
                <Check
                  className="text-muted-foreground h-5 w-5 cursor-pointer hover:text-green-500"
                  onClick={(e) => {
                    e.preventDefault()
                    acceptFriendRequest({ user_id_requested: request.user_id_requested })
                  }}
                />
                <X
                  className="text-muted-foreground h-5 w-5 cursor-pointer hover:text-red-500"
                  onClick={(e) => {
                    e.preventDefault()
                    declineFriendRequest({ user_id_requested: request.user_id_requested })
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h1 className="mb-4 text-xl font-bold">{t("friendRequests.requests_sent")}</h1>
        {friendRequests?.pages[0]?.data.map((request) => (
          <div key={request.user_id_invited} className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-2">
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarImage
                    src="https://beep-image.baptistebronsin.be/logo.png"
                    alt="user avatar"
                  />
                </Avatar>
                <p>{request.user_id_invited}</p>
              </div>
              <p className="text-muted-foreground">
                {t("friendRequests.sent_at", {
                  date: new Date(request.created_at).toLocaleDateString(),
                  time: new Date(request.created_at).toLocaleTimeString(),
                })}
              </p>
            </div>
            <Trash2
              className="text-muted-foreground h-5 w-5 cursor-pointer hover:text-red-500"
              onClick={(e) => {
                e.preventDefault()
                deleteFriendRequest({ user_id_invited: request.user_id_invited })
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
