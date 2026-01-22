import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  dateString: string,
  locale: string = "en",
  t: (key: string) => string = (key) => key
): string {
  const messageDate = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  )

  const timeString = messageDate.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  })

  if (messageDay.getTime() === today.getTime()) {
    return `${t("date.today_at")} ${timeString}`
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return `${t("date.yesterday_at")} ${timeString}`
  } else {
    const dateString = messageDate.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
    return `${dateString} ${t("date.at")} ${timeString}`
  }
}
