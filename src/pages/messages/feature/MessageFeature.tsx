import MessageComponent from "@/shared/components/Message"
import {
  useDeleteMessage,
  useMessage,
  useUpdateMessage,
} from "@/shared/queries/message/message.queries"
import type { Message } from "@/shared/queries/message/message.types"
import { useUserBySub } from "@/shared/queries/user/user.queries"
import type { MentionMember } from "@/shared/components/MentionPopover"

interface MessageFeatureProps extends Message {
  content: string
  author_id: string
  created_at: string
  updated_at?: string | null
  reply_to_message_id?: string | null
  _id: string
  isCompact?: boolean
  status?: "pending" | "sent"
  currentUserDisplayName?: string
  members?: MentionMember[]
  setReplyingMessage?: () => void
}

export default function MessageFeature({
  content,
  author_id,
  created_at,
  updated_at,
  reply_to_message_id,
  _id,
  isCompact = false,
  status,
  currentUserDisplayName,
  members = [],
  setReplyingMessage,
}: MessageFeatureProps) {
  const { data: author, isLoading } = useUserBySub(author_id)
  const deleteMessageMutation = useDeleteMessage()
  const updateMessageMutation = useUpdateMessage()
  const { data: replyTo } = useMessage(reply_to_message_id || "")

  const onDelete = () => {
    deleteMessageMutation.mutate(_id)
  }

  const onEdit = (newContent: string) => {
    updateMessageMutation.mutate({ messageId: _id, body: { content: newContent } })
  }

  if (isLoading) {
    return (
      <MessageComponent
        content={content}
        profilePictureUrl={undefined}
        author="Loading..."
        authorId={author_id}
        date={created_at}
        edited={!!updated_at}
        replyTo={replyTo || undefined}
        key={_id}
        isCompact={isCompact}
        status={status}
        onDelete={onDelete}
        onEdit={onEdit}
        currentUserDisplayName={currentUserDisplayName}
        members={members}
        setReplyingMessage={setReplyingMessage}
      />
    )
  }

  return (
    <MessageComponent
      content={content}
      profilePictureUrl={undefined}
      author={author?.display_name || "Unknown"}
      authorId={author_id}
      date={created_at}
      edited={!!updated_at}
      replyTo={replyTo || undefined}
      key={_id}
      isCompact={isCompact}
      status={status}
      onDelete={onDelete}
      onEdit={onEdit}
      currentUserDisplayName={currentUserDisplayName}
      members={members}
      setReplyingMessage={setReplyingMessage}
    />
  )
}
