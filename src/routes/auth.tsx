import { createFileRoute } from "@tanstack/react-router"
import { useAuth } from "react-oidc-context"
import { useEffect } from "react"

export const Route = createFileRoute("/auth")({
  component: AuthComponent,
})

function AuthComponent() {
  const auth = useAuth()

  useEffect(() => {
    // If user is already authenticated, redirect to /discover
    if (auth.isAuthenticated) {
      window.location.href = "/discover"
      return
    }

    // If no authentication in progress, start login flow
    if (!auth.isLoading && !auth.isAuthenticated && !auth.activeNavigator) {
      auth.signinRedirect()
    }
  }, [auth])

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold">Loading...</h2>
          <p className="text-gray-600">Initializing authentication</p>
        </div>
      </div>
    )
  }

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold text-red-600">Authentication Error</h2>
          <p className="mb-4 text-gray-600">{auth.error.message}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">Login</h2>
        <p className="mb-4 text-gray-600">Redirecting to Keycloak...</p>
      </div>
    </div>
  )
}
