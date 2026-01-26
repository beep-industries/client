import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { formatDate } from "../lib/utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"
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
  onEdit?: () => void
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
        className={`hover:bg-accent group relative flex w-full items-start gap-3 px-5 pl-16 ${messageBg}`}
      >
        <div className="flex w-full flex-col wrap-anywhere">
          <p className="wrap-anywhere whitespace-pre-wrap">{content}</p>
        </div>
        <div className="absolute top-0 right-2 shrink-0">
          <MessageOptionsMenu onDelete={onDelete} onEdit={onEdit} onPin={onPin} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`hover:bg-accent group mt-3 flex h-fit w-full items-start gap-3 px-5 ${messageBg}`}
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
        <p className="wrap-anywhere whitespace-pre-wrap">{content}</p>
      </div>

      <div className="absolute top-3 right-2 shrink-0">
        <MessageOptionsMenu onDelete={onDelete} onEdit={onEdit} onPin={onPin} />
      </div>

      <MemberDialog member={memberData} open={showProfile} onOpenChange={setShowProfile} />
    </div>
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
