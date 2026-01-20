import type { Message } from "./reducers/MessageReducer"

export function shouldBeCompact(
  currentMsg: Message,
  index: number,
  sortedMessages: Message[]
): boolean {
  if (index === 0) return false

  const previousMsg = sortedMessages[index - 1]
  if (previousMsg.author_id !== currentMsg.author_id) return false

  const timeDiff =
    new Date(currentMsg.created_at).getTime() - new Date(previousMsg.created_at).getTime()
  const oneMinute = 60 * 1000

  return timeDiff < oneMinute
}
