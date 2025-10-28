import { useMutation } from "@tanstack/react-query"
import { getTokens, refreshTokens, revokeAuthCookies } from "./auth.api"

export const authKeys = {
  tokens: ["tokens"] as const,
}

export const useAuthTokensMutation = () =>
  useMutation({
    mutationFn: getTokens,
    mutationKey: authKeys.tokens,
  })

export const useRefreshTokensMutation = () =>
  useMutation({
    mutationFn: refreshTokens,
    mutationKey: authKeys.tokens,
  })

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: revokeAuthCookies,
    mutationKey: authKeys.tokens,
  })
