import * as React from "react"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { ModeToggle } from "@/features/init/components/ModeToggle"
import { LanguageToggle } from "@/features/init/components/LanguageToggle"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

export const Route = createRootRoute({
  context: () => ({ queryClient }),
  component: RootComponent,
})


function RootComponent() {
  return (
    <React.Fragment>
      <div className="flex flex-col h-screen ">
        <div className="flex flex-row justify-end gap-1 p-2">
          <ModeToggle />
          <LanguageToggle />
        </div>
        <div className="flex flex-col h-full">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  )
}
