import { useTranslation } from "react-i18next"
import { PictureForm, PicturePreview } from "../PictureForm"
import { Button } from "../ui/Button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import { useUploadFile } from "@/shared/queries/content/content.queries"
import {
  useGetProfilePictureSignedURL,
  useUpdateCurrentUser,
} from "@/shared/queries/user/user.queries"

interface UserSettingsDialogProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
    avatar: string
  }
  setOpen: (open: boolean) => void
}

export function UserSettingsDialog({ children, setOpen }: UserSettingsDialogProps) {
  const { t } = useTranslation()
  const { data } = useGetProfilePictureSignedURL()
  const { mutate } = useUploadFile()
  const { mutate: updateUser } = useUpdateCurrentUser()
  return (
    <>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-110">
        <PictureForm
          handleImageChange={async (image) => {
            if (!data?.url) return
            mutate({
              file: image,
              signedURL: data.url,
            })
          }}
          handleSubmit={async () => {
            if (!data?.url) return
            const parsedUrl = new URL(data.url)
            const newUrl =
              import.meta.env.VITE_CONTENT_SERVICE_URL +
              "/public" +
              parsedUrl.pathname +
              "?" +
              new Date().getTime()
            updateUser({
              profile_picture: newUrl,
            })
            setOpen(false)
          }}
        >
          <div className="flex flex-col items-start justify-between gap-5 p-4">
            <DialogHeader>
              <DialogTitle>{t("userNav.change_picture")}</DialogTitle>
            </DialogHeader>
            <div className="relative h-full w-full">
              <PicturePreview className="h-100 w-100" boxClassName="w-100 h-100" />
            </div>
            <DialogFooter className="align-left flex w-full">
              <DialogClose asChild>
                <Button variant="outline">{t("settings.cancel")}</Button>
              </DialogClose>
              <Button type="submit">{t("settings.save_changes")}</Button>
            </DialogFooter>
          </div>
        </PictureForm>
      </DialogContent>
    </>
  )
}
