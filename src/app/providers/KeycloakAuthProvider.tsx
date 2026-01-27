import type { User } from "@/shared/models/user"
import { type User as OidcUser } from "oidc-client-ts"
import { useRouteContext } from "@tanstack/react-router"

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  accessToken: string | null
  login: () => void
  logout: () => void
  signinSilent: () => Promise<string | null>
  subscribeToTokenRefresh: (callback: (token: string) => void) => () => void
  error: Error | null
  activeNavigator: string | undefined
}

export function mapOidcUserToUser(oidcUser: OidcUser | null | undefined): User | null {
  if (!oidcUser?.profile) return null

  const profile = oidcUser.profile
  return {
    id: profile.sub,
    email: profile.email ?? "",
    username: profile.preferred_username ?? profile.email ?? "",
    profilePicture: profile.picture,
    totpAuthentication: false,
    verifiedAt: profile.email_verified ? new Date() : null,
  }
}

export function useAuth() {
  const { auth } = useRouteContext({ from: "__root__" })
  return auth
}
