import { createFileRoute, Link } from "@tanstack/react-router"
import { useAuth } from "react-oidc-context"
import { LogIn, Loader2 } from "lucide-react"

export const Route = createFileRoute("/keycloak-auth")({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()

  const handleLogin = () => {
    auth.signinRedirect({
      redirect_uri: `${window.location.origin}/discover`,
    })
  }

  // If user is already authenticated, show button to access the app
  if (auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">Welcome!</h1>
          <p className="mb-8 text-lg text-gray-600">You are already logged in</p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Access the application
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome</h1>
          <p className="mb-8 text-lg text-gray-600">Log in to access the application</p>

          <button
            onClick={handleLogin}
            disabled={auth.isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {auth.isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Log in
              </>
            )}
          </button>

          {auth.error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-600">{auth.error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
