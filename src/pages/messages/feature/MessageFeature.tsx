import MessageComponent from "@/shared/components/Message"
import type { Message } from "@/shared/queries/message/message.types"
import { useUserBySub } from "@/shared/queries/user/user.queries"

export default function MessageFeature({
  content,
  author_id,
  created_at,
  updated_at,
  reply_to_message_id,
  _id,
}: Message) {
  const { data: author, isLoading } = useUserBySub(author_id)

  if (isLoading) {
    return (
      <MessageComponent
        content={content}
        profilePictureUrl={undefined}
        author="Loading..."
        date={created_at}
        edited={!!updated_at}
        replyTo={reply_to_message_id || undefined}
        key={_id}
      />
    )
  }

  return (
    <MessageComponent
      content={content}
      profilePictureUrl={undefined}
      author={author?.display_name || "Unknown"}
      date={created_at}
      edited={!!updated_at}
      replyTo={reply_to_message_id || undefined}
      key={_id}
    />
  )
}
