import {
  createRootRouteWithContext,
} from "@tanstack/react-router"
import type { AuthState } from "@/app/providers/KeycloakAuthProvider"
import AppLayout from "@/layouts/app-layout"

interface AppContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: AppLayout,
})
