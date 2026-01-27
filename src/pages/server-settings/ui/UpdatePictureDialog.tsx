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

interface UpdatePictureDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (blob: Blob) => void
}

function UpdatePictureDialogContent({
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
        <DialogTitle>{t("serverSettings.updatePicture.title")}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <PicturePreview className="mx-auto h-60 w-60" boxClassName="w-60 h-60" />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{t("common.cancel")}</Button>
        </DialogClose>
        <Button onClick={onSubmit} disabled={!compressedImage}>
          {t("serverSettings.updatePicture.save")}
        </Button>
      </DialogFooter>
    </>
  )
}

export default function UpdatePictureDialog({
  isOpen,
  onOpenChange,
  onSave,
}: UpdatePictureDialogProps) {
  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <PictureForm compressionOptions={{ maxWidth: 800, maxHeight: 800, quality: 0.9 }}>
          <UpdatePictureDialogContent onSave={onSave} onClose={handleClose} />
        </PictureForm>
      </DialogContent>
    </Dialog>
  )
}
