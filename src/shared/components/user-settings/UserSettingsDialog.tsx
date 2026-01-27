import { useTranslation } from "react-i18next"
import { PictureForm, PicturePreview } from "../PictureForm"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
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

export function UserSettingsDialog({ children, user }: UserSettingsDialogProps) {
  const { t } = useTranslation()
  return (
    <>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xs">
        <div className="flex flex-col items-start justify-between gap-5 p-4">
          <DialogHeader>
            <DialogTitle>{t("userNav.change_picture")}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full">
            <PictureForm className="flex w-full flex-col items-center justify-center">
              <PicturePreview className="size-50">
                <Avatar className="h-full w-full rounded-md">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-responsive-xl size-50 h-full w-full">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PicturePreview>
            </PictureForm>
          </div>
          <DialogFooter className="align-left flex w-full">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </>
  )
}
