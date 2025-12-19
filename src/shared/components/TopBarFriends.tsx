import { useTranslation } from "react-i18next"
import TopBar from "./TopBar"
import { Button } from "./ui/Button"
import { UserPlus } from "lucide-react"
import { Badge } from "./ui/Badge"
import { useCreateFriendRequest, useFriendRequests } from "../queries/community/community.queries"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { useEffect, useState } from "react"
import { AddFriendRequestForm } from "../forms/AddFriendRequest"
import { useForm } from "react-hook-form"
import type z from "zod"
import { addFriendRequestFormSchema } from "../zod/add-friend-request"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export default function TopBarFriends() {
  const { t } = useTranslation()

  const { data: friendRequests } = useFriendRequests()
  const {
    mutateAsync: createFriendRequest,
    isPending: isCreatingFriendRequest,
    isError: isCreateFriendRequestError,
    isSuccess: isCreateFriendRequestSuccess,
    data: createdFriendRequest,
  } = useCreateFriendRequest()

  const addFriendRequestForm = useForm<z.infer<typeof addFriendRequestFormSchema>>({
    resolver: zodResolver(addFriendRequestFormSchema),
    defaultValues: {
      user_id_invited: "",
    },
  })

  const onSubmitAddFriendRequest = async (values: z.infer<typeof addFriendRequestFormSchema>) => {
    createFriendRequest({
      user_id_invited: values.user_id_invited,
    })
  }

  const [isCreateFriendRequestModalOpen, setIsCreateFriendRequestModalOpen] =
    useState<boolean>(false)

  useEffect(() => {
    if (!isCreateFriendRequestModalOpen) {
      addFriendRequestForm.reset()
    }
  }, [isCreateFriendRequestModalOpen, addFriendRequestForm])

  useEffect(() => {
    if (isCreateFriendRequestSuccess) {
      setIsCreateFriendRequestModalOpen(false)
      toast.success(t("topBar.modal.create_friend_request.success"))
    } else if (isCreateFriendRequestError) {
      toast.error(t("topBar.modal.create_friend_request.error"))
    }
  }, [isCreateFriendRequestError, isCreateFriendRequestSuccess, createdFriendRequest, t])

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
            <Button variant="ghost">
              <p>{t("topBar.friend_requests")}</p>
            </Button>
            {friendRequests && friendRequests.pages[0]?.total > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                variant="destructive"
              >
                {friendRequests.pages[0]?.total <= 99 ? friendRequests.pages[0]?.total : "99+"}
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
