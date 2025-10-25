import * as React from "react"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { ModeToggle } from "@/features/init/components/ModeToggle"
import { useTranslation } from "react-i18next"
import { LanguageToggle } from "@/features/init/components/LanguageToggle"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

export const Route = createRootRoute({
  context: () => ({ queryClient }),
  component: RootComponent,
})

console.log("Loaded __root route")

function RootComponent() {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <div>Hello "__root"!</div>
      <div>{t("home.title")}</div>
      <ModeToggle />
      <LanguageToggle />
      <Outlet />
    </React.Fragment>
  )
}
