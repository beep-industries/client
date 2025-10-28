import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAuth } from "react-oidc-context"
import { useEffect } from "react"

export const Route = createFileRoute("/discover")({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate({ to: "/auth" })
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate])

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chargement...</h2>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null // Will redirect via beforeLoad
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Page Discover</h1>
      <p className="text-gray-600 mb-4">
        Bienvenue, {auth.user?.profile.preferred_username || "utilisateur"} !
      </p>
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Informations utilisateur :</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(auth.user?.profile, null, 2)}
          </pre>
        </div>
        <button
          onClick={() => auth.signoutRedirect()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
