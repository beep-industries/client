import { Button } from "@/shared/components/ui/button"
import { useLogoutMutation } from "@/shared/queries/auth/auth.queries"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { mutate: logout, isSuccess: logoutSuccess } = useLogoutMutation()
  useEffect(() => {
    if (logoutSuccess) location.reload()
  }, [logoutSuccess])
  return (
    <div className="flex w-1/2 flex-col">
      Hello "/"!
      <Button onClick={() => logout()}>{t("common.logout")}</Button>
    </div>
  )
}
