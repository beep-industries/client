import { useState } from "react"
import { useServerById, useUpdateServer } from "@/shared/queries/community/community.queries"
import { PageServerProfileSettings } from "../ui/PageServerProfileSettings"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import type { Server } from "@/shared/queries/community/community.types"

interface PageServerProfileSettingsFeatureProps {
  serverId: string
}

export function PageServerProfileSettingsFeature({
  serverId,
}: PageServerProfileSettingsFeatureProps) {
  const { t } = useTranslation()
  const { data, isError, isSuccess, isLoading } = useServerById(serverId)
  const updateServerMutation = useUpdateServer(serverId)
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
  const [isPictureDialogOpen, setIsPictureDialogOpen] = useState(false)

  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleNameChange = async (_server: Server, newName: string) => {
    if (!newName.trim()) {
      toast.error(t("serverNav.validation.name_required"))
      return
    }

    if (newName.length > 255) {
      toast.error(t("serverNav.validation.name_too_long"))
      return
    }

    try {
      await updateServerMutation.mutateAsync({ name: newName })
      toast.success(t("serverSettings.updateName.success"))
    } catch (error) {
      console.error("Error updating server name:", error)
      toast.error(t("serverSettings.updateName.error"))
    }
  }

  const handleDescriptionClick = () => {
    setIsDescriptionDialogOpen(true)
  }

  const handleDescriptionSave = async (description: string) => {
    try {
      await updateServerMutation.mutateAsync({ description })
      toast.success(t("serverSettings.updateDescription.success"))
    } catch (error) {
      console.error("Error updating server description:", error)
      toast.error(t("serverSettings.updateDescription.error"))
    }
  }

  const handleBannerClick = () => {
    setIsBannerDialogOpen(true)
  }

  const handleBannerSave = async (blob: Blob) => {
    try {
      const dataUrl = await blobToDataUrl(blob)
      await updateServerMutation.mutateAsync({ banner_url: dataUrl })
      toast.success(t("serverSettings.updateBanner.success"))
    } catch (error) {
      console.error("Error updating server banner:", error)
      toast.error(t("serverSettings.updateBanner.error"))
    }
  }

  const handlePictureClick = () => {
    setIsPictureDialogOpen(true)
  }

  const handlePictureSave = async (blob: Blob) => {
    try {
      const dataUrl = await blobToDataUrl(blob)
      await updateServerMutation.mutateAsync({ picture_url: dataUrl })
      toast.success(t("serverSettings.updatePicture.success"))
    } catch (error) {
      console.error("Error updating server picture:", error)
      toast.error(t("serverSettings.updatePicture.error"))
    }
  }

  return (
    <PageServerProfileSettings
      server={data}
      isServerLoading={isLoading}
      isServerError={isError}
      isServerSuccess={isSuccess}
      onNameChange={handleNameChange}
      onDescriptionClick={handleDescriptionClick}
      onDescriptionSave={handleDescriptionSave}
      isDescriptionDialogOpen={isDescriptionDialogOpen}
      setIsDescriptionDialogOpen={setIsDescriptionDialogOpen}
      onBannerClick={handleBannerClick}
      onBannerSave={handleBannerSave}
      isBannerDialogOpen={isBannerDialogOpen}
      setIsBannerDialogOpen={setIsBannerDialogOpen}
      onPictureClick={handlePictureClick}
      onPictureSave={handlePictureSave}
      isPictureDialogOpen={isPictureDialogOpen}
      setIsPictureDialogOpen={setIsPictureDialogOpen}
    />
  )
}
