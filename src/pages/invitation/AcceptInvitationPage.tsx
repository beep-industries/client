import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAcceptServerInvitation } from "@/shared/queries/community/community.queries"
import { useTranslation } from "react-i18next"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"

interface AcceptInvitationPageProps {
  invitationId: string
}

export default function AcceptInvitationPage({ invitationId }: AcceptInvitationPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    mutateAsync: acceptInvitation,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useAcceptServerInvitation()

  useEffect(() => {
    if (invitationId) {
      acceptInvitation(invitationId).catch((err) => {
        console.error("Error accepting invitation:", err)
      })
    }
  }, [invitationId, acceptInvitation])

  useEffect(() => {
    if (isSuccess && data) {
      const response = data as { server_id: string }
      setTimeout(() => {
        navigate({ to: `/servers/${response.server_id}` })
      }, 2000)
    }
  }, [isSuccess, data, navigate])

  const handleGoHome = () => {
    navigate({ to: "/explore" })
  }

  const getErrorMessage = () => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } }
      return err?.response?.data?.message || t("serverInvitation.accept_error")
    }
    return t("serverInvitation.accept_error")
  }

  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-4 p-6">
        {isPending ? (
          <>
            <Loader2 className="text-muted-foreground h-12 w-12 animate-spin" />
            <p className="text-muted-foreground text-center">{t("serverInvitation.accepting")}</p>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-center text-xl font-semibold">
              {t("serverInvitation.success_title")}
            </h2>
            <p className="text-muted-foreground text-center">
              {t("serverInvitation.accept_success")}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleGoHome}>
                {t("serverInvitation.go_home")}
              </Button>
            </div>
          </>
        ) : isError ? (
          <>
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-center text-xl font-semibold">
              {t("serverInvitation.error_title")}
            </h2>
            <p className="text-muted-foreground text-center">{getErrorMessage()}</p>
            <Button onClick={handleGoHome} className="mt-4">
              {t("serverInvitation.go_home")}
            </Button>
          </>
        ) : (
          <>
            <Loader2 className="text-muted-foreground h-12 w-12 animate-spin" />
            <p className="text-muted-foreground text-center">{t("serverInvitation.loading")}</p>
            <Button variant="outline" onClick={handleGoHome} className="mt-4">
              {t("serverInvitation.go_to_app")}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
