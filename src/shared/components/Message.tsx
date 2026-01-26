import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { cn, formatDate } from "../lib/utils"
import { useTranslation } from "react-i18next"
import { useState, useRef, useEffect } from "react"
import MemberDialog, { type MemberData } from "./MemberDialog"
import { Button } from "./ui/Button"
import { Ellipsis } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "./ui/DropdownMenu"
import { useKeyboard } from "../hooks/UseKeyboard"

interface MessageProps {
  content: string
  author: string
  replyTo?: string
  date: string
  edited: boolean
  profilePictureUrl?: string
  isCompact?: boolean
  authorId?: string
  authorStatus?: MemberData["status"]
  authorDescription?: string
  status?: "pending" | "sent"
  onDelete?: () => void
  onEdit?: (newContent: string) => void
  onPin?: () => void
}

export default function MessageComponent({
  content,
  profilePictureUrl,
  author,
  date,
  isCompact = false,
  authorId,
  authorStatus,
  authorDescription,
  status,
  onDelete,
  onEdit,
  onPin,
}: MessageProps) {
  const { t, i18n } = useTranslation()
  const [showProfile, setShowProfile] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const memberData: MemberData = {
    id: authorId || "",
    username: author,
    avatar_url: profilePictureUrl,
    status: authorStatus,
    description: authorDescription,
  }

  // Couleur selon le status
  let messageBg = ""
  if (status === "pending") messageBg = "text-muted-foreground"

  if (isCompact) {
    return (
      <div
        className={cn(
          `group relative flex w-full items-start gap-3 px-5 py-1 pl-16`,
          messageBg,
          !editMode && "hover:bg-accent"
        )}
      >
        <div className="flex w-full flex-col wrap-anywhere">
          {editMode ? (
            <EditMessageForm
              initialContent={content}
              onSave={(newContent) => {
                setEditMode(false)
                if (onEdit && newContent !== content) onEdit(newContent)
              }}
              onCancel={() => setEditMode(false)}
              t={t}
            />
          ) : (
            <p className="wrap-anywhere whitespace-pre-wrap">{content}</p>
          )}
        </div>
        <div className="absolute top-0 right-2 shrink-0">
          <MessageOptionsMenu onDelete={onDelete} onEdit={() => setEditMode(true)} onPin={onPin} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        `group mt-3 flex h-fit w-full items-start gap-3 px-5 py-1`,
        messageBg,
        !editMode && "hover:bg-accent"
      )}
    >
      <Avatar
        className="mt-1 h-8 w-8 cursor-pointer rounded-lg grayscale"
        onClick={() => setShowProfile(true)}
      >
        <AvatarImage src={profilePictureUrl} alt={author} />
        <AvatarFallback className="rounded-lg">{author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col wrap-anywhere">
        <div className="flex items-center gap-2">
          <h3 className="cursor-pointer font-semibold" onClick={() => setShowProfile(true)}>
            {author}
          </h3>
          <p className="text-muted-foreground text-xs">{formatDate(date, i18n.language, t)}</p>
        </div>
        {editMode ? (
          <EditMessageForm
            initialContent={content}
            onSave={(newContent) => {
              setEditMode(false)
              if (onEdit && newContent !== content) onEdit(newContent)
            }}
            onCancel={() => setEditMode(false)}
            t={t}
          />
        ) : (
          <p className="wrap-anywhere whitespace-pre-wrap">{content}</p>
        )}
      </div>

      <div className="absolute top-3 right-2 shrink-0">
        <MessageOptionsMenu onDelete={onDelete} onEdit={() => setEditMode(true)} onPin={onPin} />
      </div>

      <MemberDialog member={memberData} open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}

function EditMessageForm({
  initialContent,
  onSave,
  onCancel,
  t,
}: {
  initialContent: string
  onSave: (newContent: string) => void
  onCancel: () => void
  t: (key: string) => string
}) {
  const [value, setValue] = useState(initialContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Focus textarea when component mounts (edit mode entered)
  useEffect(() => {
    // Delay focus to ensure textarea is mounted
    const timer = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        // Move cursor to end of text
        const len = textareaRef.current.value.length
        textareaRef.current.setSelectionRange(len, len)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useKeyboard({
    key: "Enter",
    element: textareaRef.current,
    onKeyDown: (event) => {
      if (!event.shiftKey) {
        event.preventDefault()
        if (value.trim() !== "") {
          onSave(value)
        }
      }
    },
  })

  useKeyboard({
    key: "Escape",
    element: textareaRef.current,
    onKeyDown: (event) => {
      event.preventDefault()
      onCancel()
    },
  })

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim() !== "") {
          onSave(value)
        }
      }}
    >
      <textarea
        ref={textareaRef}
        className="w-full resize-none rounded border p-2 focus:ring-0 focus:outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
      />
      <div className="mt-1 flex gap-2">
        <Button type="submit" size="sm" variant="default" disabled={value.trim() === ""}>
          {t("messages.save")}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          {t("messages.cancel")}
        </Button>
      </div>
    </form>
  )
}

function MessageOptionsMenu({
  onEdit,
  onDelete,
  onPin,
}: {
  onEdit?: () => void
  onDelete?: () => void
  onPin?: () => void
}) {
  const [open, setOpen] = useState(false)
  const t = useTranslation().t

  return (
    <div className="relative">
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className={`dark:bg-oklch(1 0 0 / 15%) dark:border-input dark:hover:bg-oklch(1 0 0 / 15%) relative -top-1 h-8 w-8 opacity-100 ${open ? "block" : "hidden group-hover:block"}`}
            variant="outline"
            size="xs"
            aria-label="Message actions"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
          <DropdownMenuGroup>
            {onEdit && (
              <DropdownMenuItem
                onSelect={() => {
                  onEdit()
                }}
              >
                {t("messages.edit")}
              </DropdownMenuItem>
            )}
            {onPin && (
              <DropdownMenuItem
                onSelect={() => {
                  onPin()
                }}
              >
                {t("messages.pin")}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onSelect={() => {
                  onDelete()
                }}
                variant="destructive"
              >
                {t("messages.delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
