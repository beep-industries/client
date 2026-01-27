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

interface UserSettingsDialogProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function UserSettingsDialog({ children }: UserSettingsDialogProps) {
  const { t } = useTranslation()
  return (
    <>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-110">
        <div className="flex flex-col items-start justify-between gap-5 p-4">
          <DialogHeader>
            <DialogTitle>{t("userNav.change_picture")}</DialogTitle>
          </DialogHeader>
          <div className="relative h-full w-full">
            <PictureForm className="flex w-full flex-col items-center justify-center">
              <PicturePreview className="h-100 w-100" boxClassName="w-100 h-100" />
            </PictureForm>
          </div>
          <DialogFooter className="align-left flex w-full">
            <DialogClose asChild>
              <Button variant="outline">{t("settings.cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("settings.save_changes")}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </>
  )
}
