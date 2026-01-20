import { useEffect } from "react"

const APP_NAME = "Beep"

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${APP_NAME}`
    } else {
      document.title = APP_NAME
    }
  }, [title])
}
