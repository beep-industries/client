import SendingBar from "@/shared/components/SendingBar"
import type { Message } from "../reducers/MessageReducer"
import MessageComponent from "@/shared/components/Message"
import type { CreateMessageRequest } from "@/shared/queries/message/message.queries"

interface PageMessagesProps {
  messages: Message[]
  sendMessage: (messageData: Omit<CreateMessageRequest, "channel_id">) => Promise<Message>
}

export default function PageMessages({ messages, sendMessage }: PageMessagesProps) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div id="messages-section" className="h-full overflow-scroll">
        {messages.map((msg) => (
          <MessageComponent
            content={msg.content}
            profilePictureUrl={msg.author_id}
            authorId={msg.author_id}
            date={msg.created_at}
            edited={!!msg.updated_at}
            replyTo={msg.reply_to_message_id || undefined}
            key={msg._id}
          />
        ))}
      </div>
      <div className="flex justify-center p-4">
        <SendingBar sendMessage={sendMessage} />
      </div>
    </div>
  )
}
