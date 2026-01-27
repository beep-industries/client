import ServerCard from "@/shared/components/ServerCard"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { Server } from "@/shared/queries/community/community.types"
import UpdateDescriptionDialog from "./UpdateDescriptionDialog"
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
              descriptionSize="large"
            />
          </div>
          <UpdateDescriptionDialog
            isOpen={isDescriptionDialogOpen}
            onOpenChange={setIsDescriptionDialogOpen}
            server={server}
            onSave={onDescriptionSave}
          />
        </>
      )}
    </div>
  )
}
