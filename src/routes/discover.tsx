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
          <h2 className="mb-4 text-2xl font-semibold">Chargement...</h2>
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
      <h1 className="mb-4 text-3xl font-bold">Page Discover</h1>
      <p className="mb-4 text-gray-600">
        Bienvenue, {auth.user?.profile.preferred_username || "utilisateur"} !
      </p>
      <div className="space-y-4">
        <div className="rounded bg-gray-100 p-4">
          <h2 className="mb-2 font-semibold">Informations utilisateur :</h2>
          <pre className="overflow-auto text-sm">{JSON.stringify(auth.user?.profile, null, 2)}</pre>
        </div>
        <button
          onClick={() => auth.signoutRedirect()}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
