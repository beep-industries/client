import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { cn, formatDate } from "../lib/utils"
import { useTranslation } from "react-i18next"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import MemberDialog, { type MemberData } from "./MemberDialog"
import { Button } from "./ui/Button"
import { Ellipsis } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "./ui/DropdownMenu"
import { useKeyboard } from "../hooks/UseKeyboard"
import type { MentionMember } from "./MentionPopover"
import type { Message } from "../queries/message/message.types"
import { useUserBySub } from "../queries/user/user.queries"

// Find all mentions in text based on known member display names
function findMentions(
  text: string,
  members: MentionMember[]
): { start: number; end: number; member: MentionMember; mentionText: string }[] {
  const mentions: { start: number; end: number; member: MentionMember; mentionText: string }[] = []
  const lowerText = text.toLowerCase()

  // Sort members by display name length (longest first) to match "John Doe" before "John"
  const sortedMembers = [...members].sort((a, b) => b.displayName.length - a.displayName.length)

  for (const member of sortedMembers) {
    const pattern = `@${member.displayName.toLowerCase()}`
    let searchIndex = 0

    while (searchIndex < lowerText.length) {
      const foundIndex = lowerText.indexOf(pattern, searchIndex)
      if (foundIndex === -1) break

      // Check if @ is at start or preceded by whitespace
      const isValidStart = foundIndex === 0 || /\s/.test(text[foundIndex - 1])

      // Check if mention ends at string end or is followed by whitespace/punctuation
      const endIndex = foundIndex + pattern.length
      const isValidEnd = endIndex >= text.length || /[\s.,!?;:]/.test(text[endIndex])

      // Check this position isn't already covered by another mention
      const isOverlapping = mentions.some((m) => foundIndex < m.end && endIndex > m.start)

      if (isValidStart && isValidEnd && !isOverlapping) {
        mentions.push({
          start: foundIndex,
          end: endIndex,
          member,
          mentionText: text.slice(foundIndex, endIndex),
        })
      }

      searchIndex = foundIndex + 1
    }
  }

  // Sort by position in text
  return mentions.sort((a, b) => a.start - b.start)
}

function parseMentions(
  text: string,
  members: MentionMember[],
  onMentionClick?: (member: MentionMember) => void
): React.ReactNode[] {
  const mentions = findMentions(text, members)
  if (mentions.length === 0) return [text]

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  for (const mention of mentions) {
    // Add text before the mention
    if (mention.start > lastIndex) {
      parts.push(text.slice(lastIndex, mention.start))
    }

    // Add styled mention
    parts.push(
      <span
        key={`mention-${mention.start}`}
        className={cn(
          "bg-primary/20 text-primary rounded px-1 py-0.5 font-medium",
          onMentionClick && "cursor-pointer hover:underline"
        )}
        onClick={
          onMentionClick
            ? (e) => {
                e.stopPropagation()
                onMentionClick(mention.member)
              }
            : undefined
        }
      >
        {mention.mentionText}
      </span>
    )

    lastIndex = mention.end
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function checkIfMentioned(
  content: string,
  currentUserDisplayName?: string,
  members?: MentionMember[]
): boolean {
  if (!currentUserDisplayName || !members) return false
  const mentions = findMentions(content, members)
  return mentions.some(
    (m) => m.member.displayName.toLowerCase() === currentUserDisplayName.toLowerCase()
  )
}

interface MessageProps {
  content: string
  author: string
  replyTo?: Message
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
  currentUserDisplayName?: string
  members?: MentionMember[]
  setReplyingMessage?: () => void
}

export default function MessageComponent({
  content,
  profilePictureUrl,
  author,
  date,
  isCompact = false,
  authorId,
  replyTo,
  authorStatus,
  authorDescription,
  status,
  onDelete,
  onEdit,
  onPin,
  currentUserDisplayName,
  members = [],
  setReplyingMessage,
}: MessageProps) {
  const { t, i18n } = useTranslation()
  const [showProfile, setShowProfile] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [mentionProfileMember, setMentionProfileMember] = useState<MentionMember | null>(null)

  const memberData: MemberData = {
    id: authorId || "",
    username: author,
    avatar_url: profilePictureUrl,
    status: authorStatus,
    description: authorDescription,
  }

  // Check if current user is mentioned in this message
  const isMentioned = useMemo(
    () => checkIfMentioned(content, currentUserDisplayName, members),
    [content, currentUserDisplayName, members]
  )

  // Couleur selon le status
  let messageBg = ""
  if (status === "pending") messageBg = "text-muted-foreground"

  // Handle click on a mention
  const handleMentionClick = useCallback((member: MentionMember) => {
    setMentionProfileMember(member)
  }, [])

  // Custom component to render text with mentions
  const TextWithMentions = useMemo(
    () =>
      ({ children }: { children?: React.ReactNode }) => {
        if (typeof children === "string") {
          return <>{parseMentions(children, members, handleMentionClick)}</>
        }
        if (Array.isArray(children)) {
          return (
            <>
              {children.map((child, i) =>
                typeof child === "string" ? (
                  <span key={i}>{parseMentions(child, members, handleMentionClick)}</span>
                ) : (
                  child
                )
              )}
            </>
          )
        }
        return <>{children}</>
      },
    [members, handleMentionClick]
  )

  // Shared message content
  const messageContent = editMode ? (
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
    <article className="prose dark:prose-invert prose-headings:my-0 prose-headings:leading-tight prose-p:my-0 prose-p:leading-normal prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-li:leading-normal prose-blockquote:my-0 prose-pre:my-0 prose-hr:my-0 wrap-anywhere *:my-0! *:mt-0! *:mb-0! **:my-0!">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: TextWithMentions,
        }}
      >
        {content}
      </Markdown>
    </article>
  )

  // Shared options menu
  const optionsMenu = (
    <MessageOptionsMenu
      onDelete={onDelete}
      onEdit={() => setEditMode(true)}
      onPin={onPin}
      setReplyingMessage={setReplyingMessage}
    />
  )

  // Create member data for mention profile dialog
  const mentionMemberData: MemberData | null = mentionProfileMember
    ? {
        id: mentionProfileMember.userId,
        username: mentionProfileMember.displayName,
        avatar_url: mentionProfileMember.avatarUrl,
      }
    : null

  return (
    <div
      className={cn(
        isCompact
          ? "group relative flex w-full items-start gap-3 px-5 py-1 pl-16"
          : "group mt-3 flex h-fit w-full items-start gap-3 px-5 py-1",
        messageBg,
        !editMode && "hover:bg-accent",
        isMentioned && "bg-primary/10"
      )}
    >
      {!isCompact && (
        <Avatar
          className="mt-1 h-8 w-8 cursor-pointer rounded-lg"
          onClick={() => setShowProfile(true)}
        >
          <AvatarImage src={profilePictureUrl} alt={author} />
          <AvatarFallback className="rounded-lg">{author.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex w-full flex-col wrap-anywhere">
        {replyTo && <ReplyTo replyingMessage={replyTo} t={t} variant="muted" />}
        {!isCompact && (
          <div className="flex items-center gap-2">
            <h3 className="cursor-pointer font-semibold" onClick={() => setShowProfile(true)}>
              {author}
            </h3>
            <p className="text-muted-foreground text-xs">{formatDate(date, i18n.language, t)}</p>
          </div>
        )}
        {messageContent}
      </div>
      <div
        className={
          isCompact ? "absolute top-0 right-2 shrink-0" : "absolute top-3 right-2 shrink-0"
        }
      >
        {optionsMenu}
      </div>
      {!isCompact && (
        <MemberDialog member={memberData} open={showProfile} onOpenChange={setShowProfile} />
      )}
      {mentionMemberData && (
        <MemberDialog
          member={mentionMemberData}
          open={!!mentionProfileMember}
          onOpenChange={(open) => !open && setMentionProfileMember(null)}
        />
      )}
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
  setReplyingMessage,
}: {
  onEdit?: () => void
  onDelete?: () => void
  onPin?: () => void
  setReplyingMessage?: () => void
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
            {setReplyingMessage && (
              <DropdownMenuItem
                onSelect={() => {
                  setReplyingMessage()
                }}
              >
                {t("messages.reply")}
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

export function ReplyTo({
  replyingMessage,
  setReplyingMessage,
  t,
  variant = "default",
}: {
  replyingMessage: Message
  setReplyingMessage?: () => void
  t: (key: string) => string
  variant?: "default" | "muted"
}) {
  const { data: author, isLoading } = useUserBySub(replyingMessage.author_id)

  return (
    <div className={cn("flex", variant === "muted" ? "text-muted-foreground" : "")}>
      <span className="mr-2">↪︎ </span>
      <span className="hidden sm:block">{t("sendingBar.replying_to")}</span>
      <strong className="ml-1">
        {isLoading ? "..." : author ? author.display_name : "Unknown User"}
      </strong>
      :
      <span
        className="ml-1 inline-block max-w-1/2 truncate align-middle hover:cursor-pointer hover:underline"
        style={{ verticalAlign: "middle" }}
        onClick={(e) => {
          // Prevent click from triggering on cancel button
          if ((e.target as HTMLElement).tagName === "BUTTON") return
          const el = document.querySelector(`[data-message-id='${replyingMessage._id}']`)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" })
            el.classList.add("bg-primary/10")
            setTimeout(() => {
              el.classList.remove("bg-primary/10")
            }, 1500)
          }
        }}
        title={replyingMessage.content}
      >
        {` ${replyingMessage.content}`}
      </span>
      {variant === "default" && setReplyingMessage && (
        <button
          className="text-primary ml-2 hover:cursor-pointer hover:underline"
          onClick={() => setReplyingMessage()}
        >
          {t("sendingBar.cancel")}
        </button>
      )}
    </div>
  )
}
