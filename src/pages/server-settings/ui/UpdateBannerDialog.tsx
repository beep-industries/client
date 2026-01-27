import { Button } from "@/shared/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/Dialog"
import { useTranslation } from "react-i18next"
import { PictureForm, PicturePreview, usePictureForm } from "@/shared/components/PictureForm"

interface UpdateBannerDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (blob: Blob) => void
}

function UpdateBannerDialogContent({
  onSave,
  onClose,
}: {
  onSave: (blob: Blob) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const { handleSubmit, compressedImage } = usePictureForm()

  const onSubmit = handleSubmit(() => {
    if (compressedImage) {
      onSave(compressedImage)
      onClose()
    }
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("serverSettings.updateBanner.title")}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <PicturePreview className="h-60 w-full" boxClassName="w-full h-60" />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{t("common.cancel")}</Button>
        </DialogClose>
        <Button onClick={onSubmit} disabled={!compressedImage}>
          {t("serverSettings.updateBanner.save")}
        </Button>
      </DialogFooter>
    </>
  )
}

export default function UpdateBannerDialog({
  isOpen,
  onOpenChange,
  onSave,
}: UpdateBannerDialogProps) {
  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <PictureForm compressionOptions={{ maxWidth: 1200, maxHeight: 400, quality: 0.9 }}>
          <UpdateBannerDialogContent onSave={onSave} onClose={handleClose} />
        </PictureForm>
      </DialogContent>
    </Dialog>
  )
}
