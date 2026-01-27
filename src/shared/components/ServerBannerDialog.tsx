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
import { ImagePlus } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface ServerBannerDialogProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

function BannerDialogContent({
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
        <DialogTitle>{t("serverNav.modal.banner_upload")}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <PicturePreview className="h-60 w-full" boxClassName="w-full h-60" />
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

export default function ServerBannerDialog({
  value,
  onChange,
  className,
}: ServerBannerDialogProps) {
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
          "bg-muted relative h-32 w-full cursor-pointer overflow-hidden rounded-lg",
          "border-border hover:border-primary border-2 border-dashed transition-colors",
          "group flex items-center justify-center",
          className
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Banner preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <ImagePlus className="h-8 w-8 text-white" />
            </div>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-2">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm">{t("serverNav.modal.click_to_upload_banner")}</span>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <PictureForm compressionOptions={{ maxWidth: 1200, maxHeight: 400, quality: 0.9 }}>
            <BannerDialogContent onSave={handleSave} onClose={() => setIsOpen(false)} />
          </PictureForm>
        </DialogContent>
      </Dialog>
    </>
  )
}
