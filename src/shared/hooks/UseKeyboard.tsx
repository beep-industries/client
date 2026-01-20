import { useEffect } from "react"

interface UseKeyboardOptions {
  key: string
  onKeyDown?: (event: KeyboardEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
  element?: HTMLElement | null
  disabled?: boolean
  preventDefault?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}

export function useKeyboard({
  key,
  onKeyDown,
  onKeyUp,
  element,
  disabled = false,
  preventDefault = false,
  ctrlKey = false,
  shiftKey = false,
  altKey = false,
}: UseKeyboardOptions) {
  useEffect(() => {
    if (disabled) return

    const targetElement = element || window

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== key) return
      if (ctrlKey && !event.ctrlKey) return
      if (shiftKey && !event.shiftKey) return
      if (altKey && !event.altKey) return

      if (preventDefault) {
        event.preventDefault()
      }

      onKeyDown?.(event)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== key) return
      if (ctrlKey && !event.ctrlKey) return
      if (shiftKey && !event.shiftKey) return
      if (altKey && !event.altKey) return

      if (preventDefault) {
        event.preventDefault()
      }

      onKeyUp?.(event)
    }

    if (onKeyDown) {
      targetElement.addEventListener("keydown", handleKeyDown as EventListener)
    }
    if (onKeyUp) {
      targetElement.addEventListener("keyup", handleKeyUp as EventListener)
    }

    return () => {
      if (onKeyDown) {
        targetElement.removeEventListener("keydown", handleKeyDown as EventListener)
      }
      if (onKeyUp) {
        targetElement.removeEventListener("keyup", handleKeyUp as EventListener)
      }
    }
  }, [key, onKeyDown, onKeyUp, element, disabled, preventDefault, ctrlKey, shiftKey, altKey])
}
