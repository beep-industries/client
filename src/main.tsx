import "@/i18n"
import "@/app/styles/index.css"
import "@/app/styles/App.css"
import ReactDOM from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen"
import { ThemeProvider } from "@/app/providers/ThemeProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, useAuth } from "@/app/providers/AuthProvider.tsx"
import { RealTimeSocketProvider } from "@/app/providers/RealTimeSocketProvider"
import { RealTimeChannelProvider } from "@/app/providers/RealTimeChannelProvider"
import { userTopics } from "@/shared/queries/real-time/user.channel.ts"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

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
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function BaseProvider() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RealTimeSocketProvider>
            <RealTimeChannelProvider topics={userTopics}>
              <AuthenticatedRouter />
            </RealTimeChannelProvider>
          </RealTimeSocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<BaseProvider />)
}
