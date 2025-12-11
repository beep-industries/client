import { createRootRouteWithContext } from "@tanstack/react-router"
import type { AuthState } from "@/app/providers/KeycloakAuthProvider"
import AppLayout from "@/layouts/AppLayout"

interface AppContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: AppLayout,
})
