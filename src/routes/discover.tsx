import { createFileRoute } from "@tanstack/react-router"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { Button } from "@/shared/components/ui/Button"
import { Loader2, LogOut } from "lucide-react"

export const Route = createFileRoute("/discover")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <h2 className="text-muted-foreground">Vérification de l'authentification...</h2>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Page Discover</h1>
      <p className="text-muted-foreground mb-4">Bienvenue, {user?.username || "utilisateur"} !</p>
      <div className="space-y-4">
        <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
          <h2 className="mb-2 font-semibold">Informations utilisateur :</h2>
          <pre className="overflow-auto text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>
        <Button variant="destructive" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
