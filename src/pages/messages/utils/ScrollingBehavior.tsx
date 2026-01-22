import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { Message } from "@/shared/queries/message/message.types"

interface ScrollingBehaviorProps {
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
  sortedMessages: Message[]
  isFetchingNextPage?: boolean
  inView: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
}

export function useScrollingBehavior({
  messagesContainerRef,
  sortedMessages,
  isFetchingNextPage,
  inView,
  hasNextPage,
  fetchNextPage,
}: ScrollingBehaviorProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showSkeletons, setShowSkeletons] = useState(false)
  const previousMessageCountRef = useRef(0)

  // Show skeletons when fetching starts
  useEffect(() => {
    if (isFetchingNextPage) {
      setShowSkeletons(true)
    }
  }, [isFetchingNextPage])

  // Hide skeletons AFTER new messages are rendered
  useLayoutEffect(() => {
    if (
      !isFetchingNextPage &&
      showSkeletons &&
      sortedMessages.length > previousMessageCountRef.current
    ) {
      // Wait for new messages to be in DOM before removing skeletons
      requestAnimationFrame(() => {
        setShowSkeletons(false)
      })
    }
    previousMessageCountRef.current = sortedMessages.length
  }, [isFetchingNextPage, sortedMessages.length, showSkeletons])

  // Scroll to bottom (initial load or new message when already at bottom)
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTop = 0 // In flex-reverse, scrollTop 0 is the bottom
  }, [messagesContainerRef])

  // Check if user is near bottom of scroll (in flex-reverse)
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return false
    const threshold = 100
    return Math.abs(container.scrollTop) < threshold
  }, [messagesContainerRef])

  // Initial scroll to bottom on first load
  useLayoutEffect(() => {
    if (isInitialLoad && sortedMessages.length > 0) {
      requestAnimationFrame(() => {
        scrollToBottom()
        setIsInitialLoad(false)
      })
    }
  }, [isInitialLoad, sortedMessages.length, scrollToBottom])

  // Fetch next page when scrolling to top (which is bottom in DOM)
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage && !isInitialLoad) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isInitialLoad])

  // Auto-scroll to bottom when new messages arrive if user is at bottom
  useEffect(() => {
    if (isInitialLoad || isFetchingNextPage) return

    const container = messagesContainerRef.current
    if (!container) return

    const wasNearBottom = isNearBottom()

    if (wasNearBottom) {
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }
  }, [
    sortedMessages.length,
    isInitialLoad,
    isFetchingNextPage,
    scrollToBottom,
    isNearBottom,
    messagesContainerRef,
  ])

  return { isInitialLoad, showSkeletons }
}
