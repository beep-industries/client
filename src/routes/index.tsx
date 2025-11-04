import { Button } from "@/shared/components/ui/button"
import { useLogoutMutation } from "@/shared/queries/auth/auth.queries"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/app/providers/AuthProvider.tsx"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { mutate: logout, isSuccess: logoutSuccess } = useLogoutMutation()
  const { user } = useAuth()

  useEffect(() => {
    if (logoutSuccess) location.reload()
  }, [logoutSuccess])

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        Hello "/"! {user?.firstName} with id {user?.id}
      </div>
      <Button onClick={() => logout()}>{t("common.logout")}</Button>
    </div>
  )
}
