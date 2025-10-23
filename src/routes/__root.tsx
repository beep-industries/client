import * as React from "react"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { ModeToggle } from "@/features/init/components/ModeToggle"
import { useTranslation } from "react-i18next"
import { LanguageToggle } from "@/features/init/components/LanguageToggle"

export const Route = createRootRoute({
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
