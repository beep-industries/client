import SendingBar from "@/shared/components/SendingBar"
import MessageSkeleton from "@/shared/components/MessageSkeleton"
import { useMemo, useRef } from "react"
import MessageFeature from "../feature/MessageFeature"
import type { Message } from "../reducers/MessageReducer"
import type { CreateMessageRequest } from "@/shared/queries/message/message.types"
import { shouldBeCompact } from "../utils"
import { useScrollingBehavior } from "../utils/ScrollingBehavior"
import { useInView } from "react-intersection-observer"

interface PageMessagesProps {
  messages: Message[]
  sendMessage: (messageData: Omit<CreateMessageRequest, "channel_id">) => Promise<Message>
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function PageMessages({
  messages,
  sendMessage,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PageMessagesProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { ref: topRef, inView } = useInView()

  const sortedMessages = useMemo(() => {
    // Sort oldest to newest, then reverse for flex-reverse display
    return [...messages]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .reverse()
  }, [messages])

  const { showSkeletons } = useScrollingBehavior({
    messagesContainerRef,
    sortedMessages,
    isFetchingNextPage,
    inView,
    hasNextPage,
    fetchNextPage,
  })

  return (
    <div className="bg-background flex h-full flex-col justify-between">
      <div
        ref={messagesContainerRef}
        id="messages-section"
        className="flex h-full flex-col-reverse gap-1 overflow-y-auto pt-2"
        style={{
          overflowAnchor: "none",
          willChange: "scroll-position",
        }}
      >
        {sortedMessages.map((msg, index) => (
          <div
            key={msg._id}
            data-message-id={msg._id}
            style={{ contain: "layout" }}
            className="p-0"
          >
            <MessageFeature {...msg} isCompact={shouldBeCompact(msg, index, sortedMessages)} />
          </div>
        ))}
        {showSkeletons && (
          <div style={{ pointerEvents: "none" }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <MessageSkeleton key={`skeleton-${i}`} compact={i % 3 === 0} />
            ))}
          </div>
        )}
        {hasNextPage && <div ref={topRef} className="h-1" />}
      </div>
      <div className="flex justify-center p-4">
        <SendingBar sendMessage={sendMessage} />
      </div>
    </div>
  )
}
