import { SigninCard } from "@/features/signin/components/SigninCard"
import { useAuth } from "@/shared/lib/auth-provider/auth"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/signin")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  component: SigninPage,
})

export function SigninPage() {
  const auth  = useAuth()
  const { navigate } = useRouter()
  const { redirect } = Route.useSearch()

  useEffect(() => {
    if (auth.isAuthenticated) navigate({ to: redirect })
  }, [auth.isAuthenticated, navigate, redirect])

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SigninCard />
    </div>
  )
}
