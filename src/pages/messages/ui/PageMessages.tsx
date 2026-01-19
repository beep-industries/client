import SendingBar from "@/shared/components/SendingBar"
import { useMemo } from "react"
import MessageFeature from "../feature/MessageFeature"
import type { Message } from "../reducers/MessageReducer"
import type { CreateMessageRequest } from "@/shared/queries/message/message.types"

interface PageMessagesProps {
  messages: Message[]
  sendMessage: (messageData: Omit<CreateMessageRequest, "channel_id">) => Promise<Message>
}

export default function PageMessages({ messages, sendMessage }: PageMessagesProps) {
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }, [messages])

  return (
    <div className="bg-background flex h-full flex-col justify-between">
      <div id="messages-section" className="h-full overflow-scroll">
        {sortedMessages.map((msg) => (
          <MessageFeature key={msg._id} {...msg} />
        ))}
      </div>
      <div className="flex justify-center p-4">
        <SendingBar sendMessage={sendMessage} />
      </div>
    </div>
  )
}
