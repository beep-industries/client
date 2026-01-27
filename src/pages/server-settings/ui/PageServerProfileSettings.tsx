import ServerCard from "@/shared/components/ServerCard"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { Server } from "@/shared/queries/community/community.types"
import UpdateDescriptionDialog from "./UpdateDescriptionDialog"
import UpdateBannerDialog from "./UpdateBannerDialog"
import UpdatePictureDialog from "./UpdatePictureDialog"
import type { Dispatch, SetStateAction } from "react"

interface PageServerProfileSettingsProps {
  server?: Server
  isServerLoading: boolean
  isServerError: boolean
  isServerSuccess: boolean
  onNameChange: (server: Server, newName: string) => void
  onDescriptionClick: () => void
  onDescriptionSave: (description: string) => void
  isDescriptionDialogOpen: boolean
  setIsDescriptionDialogOpen: Dispatch<SetStateAction<boolean>>
  onBannerClick: () => void
  onBannerSave: (blob: Blob) => void
  isBannerDialogOpen: boolean
  setIsBannerDialogOpen: Dispatch<SetStateAction<boolean>>
  onPictureClick: () => void
  onPictureSave: (blob: Blob) => void
  isPictureDialogOpen: boolean
  setIsPictureDialogOpen: Dispatch<SetStateAction<boolean>>
}
export function PageServerProfileSettings({
  server,
  isServerLoading,
  isServerSuccess,
  onNameChange,
  onDescriptionClick,
  onDescriptionSave,
  isDescriptionDialogOpen,
  setIsDescriptionDialogOpen,
  onBannerClick,
  onBannerSave,
  isBannerDialogOpen,
  setIsBannerDialogOpen,
  onPictureClick,
  onPictureSave,
  isPictureDialogOpen,
  setIsPictureDialogOpen,
}: PageServerProfileSettingsProps) {
  return (
    <div className="flex w-full justify-center">
      {isServerLoading && <Skeleton className="size-20" />}
      {isServerSuccess && server && (
        <>
          <div className="w-2/3">
            <ServerCard
              server={server}
              onNameChange={onNameChange}
              onDescriptionClick={onDescriptionClick}
              onBannerClick={onBannerClick}
              onPictureClick={onPictureClick}
              descriptionSize="large"
            />
          </div>
          <UpdateDescriptionDialog
            isOpen={isDescriptionDialogOpen}
            onOpenChange={setIsDescriptionDialogOpen}
            server={server}
            onSave={onDescriptionSave}
          />
          <UpdateBannerDialog
            isOpen={isBannerDialogOpen}
            onOpenChange={setIsBannerDialogOpen}
            onSave={onBannerSave}
          />
          <UpdatePictureDialog
            isOpen={isPictureDialogOpen}
            onOpenChange={setIsPictureDialogOpen}
            onSave={onPictureSave}
          />
        </>
      )}
    </div>
  )
}
