import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { ModeToggle } from "@/features/init/components/ModeToggle"
import { LanguageToggle } from "@/features/init/components/LanguageToggle"
import { type AuthState } from "@/shared/lib/auth-provider/auth"

interface AppContext {
  auth: AuthState // Placeholder for future auth context
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-row justify-end gap-1 p-2">
        <ModeToggle />
        <LanguageToggle />
      </div>
      <div className="flex h-full flex-col">
        <Outlet />
      </div>
    </div>
  )
}
