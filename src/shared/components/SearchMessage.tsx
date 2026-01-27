import i18n from "@/i18n"
import { useTranslation } from "react-i18next"
import { formatDate } from "../lib/utils"
import type { Message } from "../queries/message/message.types"
import { useUsersBySubs } from "../queries/user/user.queries"

export default function SearchMessage({ message }: { message: Message }) {
  const users = useUsersBySubs([message.author_id])
  const { t } = useTranslation()

  return (
    <div
      data-message-id={message._id}
      className="hover:bg-primary/10 rounded px-3 py-2 transition-colors"
    >
      <div className="flex gap-1">
        <span className="text-sm font-semibold">{users[0]?.data?.display_name}</span>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatDate(message.created_at, i18n.language, t)}
        </span>
      </div>
      <article className="wrap-break-words text-sm whitespace-pre-wrap">{message.content}</article>
    </div>
  )
}
