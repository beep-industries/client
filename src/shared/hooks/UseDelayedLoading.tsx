import { useEffect, useRef, useState } from "react"
import { LOADING_TIMEOUT, MINIMUM_SKELETON_TIME } from "../constants/ui.constants"

interface UseSkeletonLoadingResult {
  showSkeleton: boolean
  isTimeout: boolean
}

/**
 * Hook for skeleton loading with minimum display time and timeout handling.
 *
 * Behavior:
 * - Shows skeleton immediately when loading starts
 * - If loading < MINIMUM_SKELETON_TIME: keeps skeleton until minimum time reached
 * - If loading > MINIMUM_SKELETON_TIME: shows skeleton until loading completes
 * - If loading > LOADING_TIMEOUT: stops skeleton and returns isTimeout = true
 *
 * @param isLoading - The actual loading state from your data fetching
 * @returns { showSkeleton, isTimeout }
 */
export function useSkeletonLoading(isLoading: boolean): UseSkeletonLoadingResult {
  const [showSkeleton, setShowSkeleton] = useState(isLoading)
  const [isTimeout, setIsTimeout] = useState(false)
  const loadingStartTime = useRef<number | null>(null)
  const minTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isLoading) {
      // Loading started
      loadingStartTime.current = Date.now()
      setShowSkeleton(true)
      setIsTimeout(false)

      // Clear any pending minTimeout from previous loading cycle
      if (minTimeoutRef.current) {
        clearTimeout(minTimeoutRef.current)
        minTimeoutRef.current = null
      }

      // Set timeout for max loading time (1 minute)
      maxTimeoutRef.current = setTimeout(() => {
        setShowSkeleton(false)
        setIsTimeout(true)
      }, LOADING_TIMEOUT)
    } else {
      // Loading finished - check if minimum time has passed
      const elapsed = loadingStartTime.current ? Date.now() - loadingStartTime.current : 0
      const remainingMinTime = Math.max(0, MINIMUM_SKELETON_TIME - elapsed)

      // Clear max timeout since loading completed
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current)
        maxTimeoutRef.current = null
      }

      if (remainingMinTime > 0) {
        // Keep skeleton visible until minimum time
        minTimeoutRef.current = setTimeout(() => {
          setShowSkeleton(false)
        }, remainingMinTime)
      } else {
        // Minimum time already passed, hide immediately
        setShowSkeleton(false)
      }

      loadingStartTime.current = null
    }

    return () => {
      if (minTimeoutRef.current) {
        clearTimeout(minTimeoutRef.current)
        minTimeoutRef.current = null
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current)
        maxTimeoutRef.current = null
      }
    }
  }, [isLoading])

  return { showSkeleton, isTimeout }
}
