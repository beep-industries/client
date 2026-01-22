import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { formatDate } from "../lib/utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import MemberDialog, { type MemberData } from "./MemberDialog"

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
        className={`hover:bg-accent flex h-fit w-full items-start gap-3 px-5 pl-16 ${messageBg}`}
      >
        <div className="flex w-full flex-col wrap-anywhere">
          <p className="wrap-anywhere whitespace-pre-wrap">{content}</p>
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

      <MemberDialog member={memberData} open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}
