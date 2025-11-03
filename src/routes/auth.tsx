import { createFileRoute } from "@tanstack/react-router"
import { useAuth } from "react-oidc-context"
import { useEffect } from "react"

export const Route = createFileRoute("/auth")({
  component: AuthComponent,
})

function AuthComponent() {
  const auth = useAuth()

  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, rediriger vers /discover
    if (auth.isAuthenticated) {
      window.location.href = "/discover"
      return
    }

    // Si pas d'authentification en cours, démarrer le login
    if (!auth.isLoading && !auth.isAuthenticated && !auth.activeNavigator) {
      auth.signinRedirect()
    }
  }, [auth])

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold">Chargement...</h2>
          <p className="text-gray-600">Initialisation de l'authentification</p>
        </div>
      </div>
    )
  }

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold text-red-600">Erreur d'authentification</h2>
          <p className="mb-4 text-gray-600">{auth.error.message}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">Connexion</h2>
        <p className="mb-4 text-gray-600">Redirection vers Keycloak...</p>
      </div>
    </div>
  )
}
