import { cn } from "../lib/utils"
import { useRef, useEffect } from "react"
import { Button } from "./ui/Button"
import { Plus, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function SendingBar() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
  }, [])

  const { t } = useTranslation()

  return (
    <div className="flex w-full items-end">
      <div
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "flex h-fit min-h-10 items-end gap-2 pb-2"
        )}
      >
        <Plus className="text-neutral-600" />
        <textarea
          ref={textareaRef}
          className="h-6 w-full resize-none self-center pt-1 outline-none"
          rows={1}
          placeholder={t("sendingBar.placeholder")}
        />
      </div>
      <Button className="ml-2 h-10">
        <Send />
      </Button>
    </div>
  )
}
