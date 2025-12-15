import "@/i18n"
import "@/app/styles/index.css"
import "@/app/styles/App.css"
import ReactDOM from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen"
import { ThemeProvider } from "@/app/providers/ThemeProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, useAuth as useOidcAuth } from "react-oidc-context"
import { WebStorageStateStore } from "oidc-client-ts"
import { type AuthState, mapOidcUserToUser } from "@/app/providers/KeycloakAuthProvider"
import { SidebarContentProvider } from "@/app/providers/SidebarContentProvider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: `${window.location.origin}/explore`,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname)
  },
}

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
  context: { auth: undefined! },
})

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root")!

function AuthenticatedRouter() {
  const oidcAuth = useOidcAuth()

  const auth: AuthState = {
    isAuthenticated: oidcAuth.isAuthenticated,
    isLoading: oidcAuth.isLoading,
    user: mapOidcUserToUser(oidcAuth.user),
    accessToken: oidcAuth.user?.access_token ?? null,
    login: () => oidcAuth.signinRedirect(),
    logout: () => oidcAuth.signoutRedirect(),
    error: oidcAuth.error ?? null,
    activeNavigator: oidcAuth.activeNavigator,
  }

  return (
    <RouterProvider
      router={router}
      context={{ auth }}
      key={`${oidcAuth.isLoading}-${oidcAuth.isAuthenticated}`}
    />
  )
}

function BaseProvider() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...oidcConfig}>
          <SidebarContentProvider>
            <AuthenticatedRouter />
          </SidebarContentProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<BaseProvider />)
}
