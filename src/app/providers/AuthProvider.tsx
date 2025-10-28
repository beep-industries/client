import type { User } from "@/shared/models/user"
import React, { createContext, useContext, useState, useEffect } from "react"
import {
  useAuthTokensMutation,
  useLogoutMutation,
  useRefreshTokensMutation,
} from "@/shared/queries/auth/auth.queries"
import { jwtDecode } from "jwt-decode"

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
  authTokenMutation: ReturnType<typeof useAuthTokensMutation>
  logoutMutation: ReturnType<typeof useLogoutMutation>
  refreshMutation: ReturnType<typeof useRefreshTokensMutation>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const authTokenMutation = useAuthTokensMutation()
  const logoutMutation = useLogoutMutation()
  const refreshMutation = useRefreshTokensMutation()

  // Restore auth state on app load
  useEffect(() => {
    // Refresh tokens only on initial load and only if the user didn't log out
    if (isAuthenticated) return
    refreshMutation.mutate()
  }, [])

  // Auto-refresh tokens every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        // Only refresh if the user is still authenticated and not in the middle of logging out
        if (isAuthenticated && logoutMutation.isIdle) {
          refreshMutation.mutate()
        }
      },
      5 * 60 * 1000
    ) // 5 minutes in milliseconds

    return () => clearInterval(interval)
  }, [])

  // Handle authentication state changes
  useEffect(() => {
    // Set authenticated state if we have valid tokens
    // If the logout mutation is idle, it means the user hasn't logged out
    if (authTokenMutation.isSuccess && authTokenMutation.data?.user) {
      setIsAuthenticated(true)
      setUser(authTokenMutation.data.user)
    }
    if (refreshMutation.isSuccess && refreshMutation.data?.accessToken) {
      setIsAuthenticated(true)
      // User info is stored in the access token
      // Decode it to get user data
      const user: User = jwtDecode(refreshMutation.data.accessToken)
      setUser(user)
    }
  }, [
    authTokenMutation.data?.user,
    authTokenMutation.isSuccess,
    refreshMutation.data?.accessToken,
    refreshMutation.isSuccess,
  ])

  useEffect(() => {
    if (refreshMutation.isError || logoutMutation.isSuccess) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [logoutMutation.isSuccess, refreshMutation.isError])

  const login = (email: string, password: string) => authTokenMutation.mutate({ email, password })
  const logout = () => logoutMutation.mutate()
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        authTokenMutation,
        logoutMutation,
        refreshMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
