import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { Button } from "@/shared/components/ui/Button"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect } from "react"
import { LogIn, Loader2 } from "lucide-react"

export const Route = createFileRoute("/signin")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/discover",
  }),
  component: SigninPage,
})

export function SigninPage() {
  const { isAuthenticated, isLoading, login, error } = useAuth()
  const { navigate } = useRouter()
  const { redirect } = Route.useSearch()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirect })
    }
  }, [isAuthenticated, navigate, redirect])

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Beep</h1>
        <p className="text-muted-foreground">Sign in to continue</p>

        <Button onClick={() => login()} className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign in with Keycloak
        </Button>

        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
