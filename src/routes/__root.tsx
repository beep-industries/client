import { createRootRouteWithContext, Outlet, useLocation } from "@tanstack/react-router"
import type { AuthState } from "@/app/providers/KeycloakAuthProvider"
import AppLayout from "@/layouts/AppLayout"
import { Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { hasAuthParams } from "react-oidc-context"

interface AppContext {
  auth: AuthState
}

function RootComponent() {
  const { auth } = Route.useRouteContext()
  const hasTriedSignin = useRef(false)
  const location = useLocation()

  // Check if we're on the invitations route (should bypass auth check)
  const isInvitationRoute = location.pathname.startsWith("/invitations/")

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (auth.isAuthenticated) {
      hasTriedSignin.current = false
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    if (
      !isInvitationRoute &&
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !hasTriedSignin.current
    ) {
      hasTriedSignin.current = true
      auth.login()
    }
  }, [auth, isInvitationRoute])

  // For invitation routes, render directly without auth check
  if (isInvitationRoute) {
    return <Outlet />
  }

  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <AppLayout />
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})
