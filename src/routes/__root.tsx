import {
  createRootRouteWithContext,
  Outlet,
  Navigate,
  useRouterState,
} from "@tanstack/react-router"
import { ModeToggle } from "@/features/init/components/ModeToggle"
import { LanguageToggle } from "@/features/init/components/LanguageToggle"
import type { AuthState } from "@/app/providers/KeycloakAuthProvider"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { Loader2 } from "lucide-react"
import { RealTimeSocketProvider } from "@/app/providers/RealTimeSocketProvider.tsx"

interface AppContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { isLoading, isAuthenticated } = useAuth()
  const location = useRouterState({ select: (s) => s.location })

  // Show loading while auth is being restored
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Redirect to signin if not authenticated (except on signin page)
  if (!isAuthenticated && location.pathname !== "/signin") {
    return <Navigate to="/signin" search={{ redirect: location.pathname }} />
  }

  return (
    <div className="flex h-screen flex-col">
      <RealTimeSocketProvider>
        <div className="flex flex-row justify-end gap-1 p-2">
          <ModeToggle />
          <LanguageToggle />
        </div>
        <div className="flex h-full flex-col">
          <Outlet />
        </div>
      </RealTimeSocketProvider>
    </div>
  )
}
