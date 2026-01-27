import { Plus, Send } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useKeyboard } from "../hooks/UseKeyboard"
import { cn } from "../lib/utils"
import type { CreateMessageRequest, Message } from "../queries/message/message.types"
import MentionPopover, { type MentionMember } from "./MentionPopover"
import { ReplyTo } from "./Message"
import { Button } from "./ui/Button"

interface SendingBarProps {
  sendMessage: (messageData: Omit<CreateMessageRequest, "channel_id">) => Promise<Message>
  members?: MentionMember[]
  replyingMessage?: Message | null
  setReplyingMessage?: () => void
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
}

export default function SendingBar({
  sendMessage,
  members = [],
  replyingMessage,
  setReplyingMessage,
  textareaRef: externalTextareaRef,
}: SendingBarProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const textareaRef = externalTextareaRef || internalTextareaRef
  const [showMentionPopover, setShowMentionPopover] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(null)
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)

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
  }, [textareaRef])

  const { t } = useTranslation()

  const getFilteredMembers = useCallback(() => {
    const query = mentionQuery.toLowerCase()
    return members.filter((member) => member.displayName.toLowerCase().includes(query)).slice(0, 10)
  }, [members, mentionQuery])

  const insertMention = useCallback(
    (member: MentionMember) => {
      const textarea = textareaRef.current
      if (!textarea || mentionStartIndex === null) return

      const before = textarea.value.substring(0, mentionStartIndex)
      const after = textarea.value.substring(textarea.selectionStart)
      const mentionText = `@${member.displayName} `

      textarea.value = before + mentionText + after
      const newCursorPos = mentionStartIndex + mentionText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()

      setShowMentionPopover(false)
      setMentionQuery("")
      setMentionStartIndex(null)
      setSelectedMentionIndex(0)
    },
    [mentionStartIndex, textareaRef]
  )

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBeforeCursor = textarea.value.substring(0, cursorPos)

    const lastAtIndex = textBeforeCursor.lastIndexOf("@")

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
      const hasSpaceAfterAt = textAfterAt.includes(" ")
      const isAtStartOrAfterSpace =
        lastAtIndex === 0 ||
        textBeforeCursor[lastAtIndex - 1] === " " ||
        textBeforeCursor[lastAtIndex - 1] === "\n"

      if (!hasSpaceAfterAt && isAtStartOrAfterSpace && members.length > 0) {
        setMentionStartIndex(lastAtIndex)
        setMentionQuery(textAfterAt)
        setShowMentionPopover(true)
        setSelectedMentionIndex(0)
        return
      }
    }

    setShowMentionPopover(false)
    setMentionQuery("")
    setMentionStartIndex(null)
  }, [members, textareaRef])

  function handleSend() {
    const textarea = textareaRef.current
    if (!textarea) return

    const content = textarea.value.trim()
    if (content.length === 0) return

    sendMessage({ content, attachments: [], reply_to_message_id: replyingMessage?._id || null })
    textarea.value = ""
    textarea.style.height = "auto"
    setShowMentionPopover(false)
    if (setReplyingMessage) setReplyingMessage()
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showMentionPopover) return

      const filteredMembers = getFilteredMembers()
      if (filteredMembers.length === 0) return

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedMentionIndex((prev) => (prev < filteredMembers.length - 1 ? prev + 1 : 0))
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : filteredMembers.length - 1))
      } else if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        if (filteredMembers[selectedMentionIndex]) {
          insertMention(filteredMembers[selectedMentionIndex])
        }
      } else if (event.key === "Escape") {
        event.preventDefault()
        setShowMentionPopover(false)
      }
    },
    [showMentionPopover, getFilteredMembers, selectedMentionIndex, insertMention]
  )

  useKeyboard({
    key: "Enter",
    element: textareaRef.current,
    onKeyDown: (event) => {
      if (showMentionPopover) return
      if (!event.shiftKey) {
        event.preventDefault()
        handleSend()
      }
    },
  })

  useKeyboard({
    key: "Escape",
    element: textareaRef.current,
    onKeyDown: () => {
      if (replyingMessage && setReplyingMessage) {
        setReplyingMessage()
      }
    },
  })

  return (
    <div className="flex w-full flex-col gap-1">
      <span className="text-muted-foreground mb-1 px-1 text-sm">
        {replyingMessage ? (
          <ReplyTo
            replyingMessage={replyingMessage}
            setReplyingMessage={setReplyingMessage}
            t={t}
          />
        ) : null}
      </span>
      <div className="relative flex w-full items-end">
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
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button className="ml-2 h-10" onClick={handleSend}>
          <Send />
        </Button>
        {showMentionPopover && (
          <MentionPopover
            members={members}
            searchQuery={mentionQuery}
            onSelect={insertMention}
            selectedIndex={selectedMentionIndex}
          />
        )}
      </div>
    </div>
  )
}
