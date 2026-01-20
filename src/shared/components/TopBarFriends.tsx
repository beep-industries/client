import { useTranslation } from "react-i18next"
import TopBar from "./TopBar"
import { Button } from "./ui/Button"
import { UserPlus } from "lucide-react"
import { Badge } from "./ui/Badge"
import {
  communityKeys,
  useCreateFriendRequest,
  useFriendInvitations,
} from "../queries/community/community.queries"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { useEffect, useState } from "react"
import { AddFriendRequestForm } from "../forms/AddFriendRequest"
import { useForm } from "react-hook-form"
import type z from "zod"
import { addFriendRequestFormSchema } from "../zod/add-friend-request"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"

export default function TopBarFriends() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: friendInvitations } = useFriendInvitations()
  const {
    mutateAsync: createFriendRequest,
    isPending: isCreatingFriendRequest,
    error: createFriendRequestError,
    isSuccess: isCreateFriendRequestSuccess,
    data: createdFriendRequest,
  } = useCreateFriendRequest()

  const addFriendRequestForm = useForm<z.infer<typeof addFriendRequestFormSchema>>({
    resolver: zodResolver(addFriendRequestFormSchema),
    defaultValues: {
      user_pseudo_invited: "",
    },
  })

  const onSubmitAddFriendRequest = async (values: z.infer<typeof addFriendRequestFormSchema>) => {
    createFriendRequest({
      user_pseudo_invited: values.user_pseudo_invited,
    })
  }

  const [isCreateFriendRequestModalOpen, setIsCreateFriendRequestModalOpen] =
    useState<boolean>(false)

  const handleError = async (error: unknown, defaultMessage: string) => {
    if (error && typeof error === "object" && "response" in error) {
      const bodyData = await (error.response as Response).json()
      if (bodyData.error_code.trim().length > 0) {
        toast.error(t("friendRequests.errors." + bodyData.error_code))
      } else if (bodyData.status == 404) {
        toast.error(t("topBar.modal.create_friend_request.errors_user_not_found"))
      } else {
        toast.error(defaultMessage)
      }
    } else {
      toast.error(defaultMessage)
    }
  }

  useEffect(() => {
    if (!isCreateFriendRequestModalOpen) {
      addFriendRequestForm.reset()
    }
  }, [isCreateFriendRequestModalOpen, addFriendRequestForm])

  useEffect(() => {
    if (isCreateFriendRequestSuccess) {
      setIsCreateFriendRequestModalOpen(false)
      queryClient.invalidateQueries({ queryKey: communityKeys.friendRequests() })
      toast.success(t("topBar.modal.create_friend_request.success"))
    } else if (createFriendRequestError) {
      handleError(createFriendRequestError, t("topBar.modal.create_friend_request.error"))
    }
  }, [createFriendRequestError, isCreateFriendRequestSuccess, createdFriendRequest, queryClient, t])

  return (
    <>
      <TopBar>
        <div className="flex w-full gap-2">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              setIsCreateFriendRequestModalOpen(true)
            }}
          >
            <UserPlus />
            <p>{t("topBar.add_friend")}</p>
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                navigate({ to: "/friends/requests" })
              }}
            >
              <p>{t("topBar.friend_requests")}</p>
            </Button>
            {friendInvitations && friendInvitations.pages[0]?.total > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                {friendInvitations.pages[0]?.total <= 99
                  ? friendInvitations.pages[0]?.total
                  : "99+"}
              </Badge>
            )}
          </div>
        </div>
      </TopBar>

      <Dialog
        open={isCreateFriendRequestModalOpen}
        onOpenChange={setIsCreateFriendRequestModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("topBar.modal.create_friend_request.title")}</DialogTitle>
          </DialogHeader>
          <AddFriendRequestForm
            form={addFriendRequestForm}
            loading={isCreatingFriendRequest}
            onSubmit={onSubmitAddFriendRequest}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
