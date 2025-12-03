import { createFileRoute } from "@tanstack/react-router"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { Label } from "@/shared/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Loader2, LogOut, Save } from "lucide-react"
import { useCurrentUser, useUpdateCurrentUser } from "@/shared/queries/user/user.queries"
import { useState, useEffect } from "react"
import type { UpdateUserRequest } from "@/shared/queries/user/user.types"

export const Route = createFileRoute("/discover")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user: authUser, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const { data: userProfile, isLoading: profileLoading } = useCurrentUser()
  const updateUser = useUpdateCurrentUser()

  const [formData, setFormData] = useState<UpdateUserRequest>({
    display_name: "",
    profile_picture: "",
    description: "",
  })

  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name,
        profile_picture: userProfile.profile_picture,
        description: userProfile.description,
      })
    }
  }, [userProfile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser.mutate(formData)
  }

  if (authLoading) {
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
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Page Discover</h1>
        <Button variant="destructive" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>

      <p className="text-muted-foreground">Bienvenue, {authUser?.username || "utilisateur"} !</p>

      <Card>
        <CardHeader>
          <CardTitle>Modifier mon profil</CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Nom d'affichage</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, display_name: e.target.value }))
                  }
                  placeholder="Votre nom d'affichage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_picture">URL de la photo de profil</Label>
                <Input
                  id="profile_picture"
                  value={formData.profile_picture}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, profile_picture: e.target.value }))
                  }
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <Button type="submit" disabled={updateUser.isPending} className="gap-2">
                {updateUser.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Enregistrer
              </Button>

              {updateUser.isSuccess && (
                <p className="text-sm text-green-600">Profil mis à jour avec succès !</p>
              )}

              {updateUser.isError && (
                <p className="text-sm text-red-600">Erreur lors de la mise à jour du profil.</p>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
            <pre className="overflow-auto text-sm">
              {JSON.stringify({ auth: authUser, profile: userProfile }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
