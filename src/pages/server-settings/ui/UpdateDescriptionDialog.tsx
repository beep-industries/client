import { useState, useEffect, useRef } from "react"
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
import type { Server } from "@/shared/queries/community/community.types"
import { cn } from "@/shared/lib/utils"

interface UpdateDescriptionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  server: Server
  onSave: (description: string) => void
}

export default function UpdateDescriptionDialog({
  isOpen,
  onOpenChange,
  server,
  onSave,
}: UpdateDescriptionDialogProps) {
  const { t } = useTranslation()
  const [description, setDescription] = useState(server.description || "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setDescription(server.description || "")
    }
  }, [isOpen, server.description])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = "auto"
      textarea.style.height = textarea.scrollHeight + "px"
    }

    textarea.addEventListener("input", adjustHeight)
    adjustHeight()

    return () => textarea.removeEventListener("input", adjustHeight)
  }, [isOpen])

  const handleSave = () => {
    onSave(description)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("serverSettings.updateDescription.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("serverSettings.updateDescription.label")}
            </label>
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("serverSettings.updateDescription.placeholder")}
              className={cn(
                "bg-background border-input text-foreground placeholder:text-muted-foreground",
                "max-h-[400px] min-h-[200px] w-full resize-none rounded-md border px-3 py-2 text-sm",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("common.cancel")}</Button>
          </DialogClose>
          <Button onClick={handleSave}>{t("serverSettings.updateDescription.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
