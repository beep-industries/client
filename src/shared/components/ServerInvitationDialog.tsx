import type { Dispatch, SetStateAction } from "react"
import { useState, useEffect } from "react"
import { Button } from "./ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/Dialog"
import { useCreateServerInvitationMutation } from "../queries/community/community.queries"
import type { ExpirationOption } from "../queries/community/community.types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Input } from "./ui/Input"

interface ServerInvitationDialogProps {
  isOpen?: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  serverId: string
}

interface InvitationResponse {
  id: string
  server_id: string
  inviter_id: string
  invitee_id: string | null
  status: string
  created_at: string
  updated_at: string | null
  expires_at: string
}

export default function ServerInvitationDialog({
  isOpen,
  onOpenChange,
  serverId,
}: ServerInvitationDialogProps) {
  const { t } = useTranslation()
  const [expiration, setExpiration] = useState<ExpirationOption>("one_week")
  const [invitationCode, setInvitationCode] = useState<string | null>(null)

  const expirationOptions: { value: ExpirationOption; label: string }[] = [
    { value: "one_day", label: t("serverInvitation.expiration.one_day") },
    { value: "one_week", label: t("serverInvitation.expiration.one_week") },
    { value: "one_month", label: t("serverInvitation.expiration.one_month") },
  ]

  const {
    mutateAsync: createInvitation,
    isPending,
    isError,
    isSuccess,
    data,
    reset,
  } = useCreateServerInvitationMutation()

  const handleCreateInvitation = async () => {
    const response = await createInvitation({
      server_id: serverId,
      expire_in: expiration,
    })
    if (response) {
      const invitationId = (response as InvitationResponse).id
      const invitationUrl = `${window.location.origin}/invitations/${invitationId}`
      setInvitationCode(invitationUrl)
    }
  }

  const handleCopyInvitation = () => {
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode)
      toast.success(t("serverInvitation.copied"))
    }
  }

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(t("serverInvitation.success"))
    } else if (isError) {
      toast.error(t("serverInvitation.error"))
      reset()
    }
  }, [isSuccess, isError, data, reset, t])

  useEffect(() => {
    if (!isOpen) {
      setExpiration("one_week")
      setInvitationCode(null)
      reset()
    }
  }, [isOpen, reset])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("serverInvitation.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {!invitationCode ? (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("serverInvitation.expiration_label")}
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {expirationOptions.find((opt) => opt.value === expiration)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {expirationOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setExpiration(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("serverInvitation.invitation_link")}</label>
              <div className="flex gap-2">
                <Input value={invitationCode} readOnly className="flex-1 font-mono text-sm" />
                <Button onClick={handleCopyInvitation}>{t("serverInvitation.copy")}</Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {invitationCode ? t("serverInvitation.close") : t("serverInvitation.cancel")}
            </Button>
          </DialogClose>
          {!invitationCode && (
            <Button onClick={handleCreateInvitation} disabled={isPending} isLoading={isPending}>
              {t("serverInvitation.create")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
