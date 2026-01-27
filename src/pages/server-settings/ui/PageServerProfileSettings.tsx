import { useState } from "react"
import ServerCard from "@/shared/components/ServerCard"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { Server } from "@/shared/queries/community/community.types"
import UpdateDescriptionDialog from "./UpdateDescriptionDialog"

interface PageServerProfileSettingsProps {
  server?: Server
  isServerLoading: boolean
  isServerError: boolean
  isServerSuccess: boolean
}
export function PageServerProfileSettings({
  server,
  isServerLoading,
  isServerSuccess,
}: PageServerProfileSettingsProps) {
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)

  const handleNameChange = (server: Server, newName: string) => {
    // TODO: Implement API call to update server name
    console.log("Updating server name:", { serverId: server.id, newName })
    // Example: updateServerMutation.mutate({ id: server.id, name: newName })
  }

  const handleDescriptionClick = () => {
    setIsDescriptionDialogOpen(true)
  }

  const handleDescriptionSave = (description: string) => {
    // TODO: Implement API call to update server description
    console.log("Updating server description:", { serverId: server?.id, description })
    // Example: updateServerMutation.mutate({ id: server.id, description })
  }

  return (
    <div className="flex w-full justify-center">
      {isServerLoading && <Skeleton className="size-20" />}
      {isServerSuccess && server && (
        <>
          <div className="w-2/3">
            <ServerCard
              server={server}
              onNameChange={handleNameChange}
              onDescriptionClick={handleDescriptionClick}
              descriptionSize="large"
            />
          </div>
          <UpdateDescriptionDialog
            isOpen={isDescriptionDialogOpen}
            onOpenChange={setIsDescriptionDialogOpen}
            server={server}
            onSave={handleDescriptionSave}
          />
        </>
      )}
    </div>
  )
}
