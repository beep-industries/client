import type { User } from "@/shared/models/user"
import React, { createContext, useContext, useMemo } from "react"
import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from "react-oidc-context"
import { WebStorageStateStore, type User as OidcUser } from "oidc-client-ts"

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  accessToken: string | null
  login: () => void
  logout: () => void
  error: Error | null
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: `${window.location.origin}/discover`,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email",
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: () => {
    // Remove OIDC params from URL after successful signin
    // Use replaceState to clean up the URL without triggering navigation
    const url = new URL(window.location.href)
    url.searchParams.delete("code")
    url.searchParams.delete("state")
    url.searchParams.delete("session_state")
    url.searchParams.delete("iss")
    window.history.replaceState({}, document.title, url.pathname)
  },
}

function mapOidcUserToUser(oidcUser: OidcUser | null | undefined): User | null {
  if (!oidcUser?.profile) return null

  const profile = oidcUser.profile
  return {
    id: profile.sub,
    email: profile.email ?? "",
    username: profile.preferred_username ?? profile.email ?? "",
    firstName: profile.given_name ?? "",
    lastName: profile.family_name ?? "",
    profilePicture: profile.picture,
    totpAuthentication: false,
    verifiedAt: profile.email_verified ? new Date() : null,
  }
}

function KeycloakAuthContextProvider({ children }: { children: React.ReactNode }) {
  const oidcAuth = useOidcAuth()

  const authState = useMemo<AuthState>(() => {
    return {
      isAuthenticated: oidcAuth.isAuthenticated,
      isLoading: oidcAuth.isLoading,
      user: mapOidcUserToUser(oidcAuth.user),
      accessToken: oidcAuth.user?.access_token ?? null,
      login: () => oidcAuth.signinRedirect(),
      logout: () =>
        oidcAuth.signoutRedirect({
          post_logout_redirect_uri: window.location.origin,
        }),
      error: oidcAuth.error ?? null,
    }
  }, [oidcAuth])

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export function KeycloakAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <KeycloakAuthContextProvider>{children}</KeycloakAuthContextProvider>
    </OidcAuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a KeycloakAuthProvider")
  }
  return context
}
