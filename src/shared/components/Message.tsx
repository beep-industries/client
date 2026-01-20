import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { formatDate } from "../lib/utils"
import { useTranslation } from "react-i18next"

interface MessageProps {
  content: string
  author: string
  replyTo?: string
  date: string
  edited: boolean
  profilePictureUrl?: string
  isCompact?: boolean
}

export default function MessageComponent({
  content,
  profilePictureUrl,
  author,
  date,
  isCompact = false,
}: MessageProps) {
  const { t, i18n } = useTranslation()

  if (isCompact) {
    return (
      <div className="hover:bg-accent flex h-fit w-full items-start gap-3 px-5 pb-1 pl-16">
        <div className="flex flex-col">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hover:bg-accent mt-3 flex h-fit w-full items-start gap-3 px-5 pb-1">
      <Avatar className="mt-1 h-8 w-8 rounded-lg grayscale">
        <AvatarImage src={profilePictureUrl} alt={author} />
        <AvatarFallback className="rounded-lg">{author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{author}</h3>
          <p className="text-muted-foreground text-xs">{formatDate(date, i18n.language, t)}</p>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}
