import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar"
import { ImagePlus } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface ServerPictureDialogProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

function PictureDialogContent({
  onSave,
  onClose,
}: {
  onSave: (dataUrl: string) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const { handleSubmit, compressedImage } = usePictureForm()

  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const onSubmit = handleSubmit(async () => {
    if (compressedImage) {
      const dataUrl = await blobToDataUrl(compressedImage)
      onSave(dataUrl)
      onClose()
    }
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("serverNav.modal.picture_upload")}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <PicturePreview className="mx-auto h-60 w-60" boxClassName="w-60 h-60" />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{t("common.cancel")}</Button>
        </DialogClose>
        <Button onClick={onSubmit} disabled={!compressedImage}>
          {t("serverNav.modal.save")}
        </Button>
      </DialogFooter>
    </>
  )
}

export default function ServerPictureDialog({
  value,
  onChange,
  className,
}: ServerPictureDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = (dataUrl: string) => {
    onChange(dataUrl)
    setIsOpen(false)
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          "group relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg",
          className
        )}
      >
        {value ? (
          <>
            <Avatar className="h-full w-full rounded-lg">
              <AvatarImage src={value} alt="Picture preview" />
              <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                <ImagePlus className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <ImagePlus className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="bg-muted border-border hover:border-primary flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors">
            <ImagePlus className="text-muted-foreground h-6 w-6" />
            <span className="text-muted-foreground px-1 text-center text-xs">
              {t("serverNav.modal.click_to_upload")}
            </span>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <PictureForm compressionOptions={{ maxWidth: 800, maxHeight: 800, quality: 0.9 }}>
            <PictureDialogContent onSave={handleSave} onClose={() => setIsOpen(false)} />
          </PictureForm>
        </DialogContent>
      </Dialog>
    </>
  )
}
