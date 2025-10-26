import { useMutation } from "@tanstack/react-query"
import { getTokens } from "./auth.api";

export const authKeys = {
  tokens: ["tokens"] as const
}

export const useAuthTokens = () => useMutation({
  mutationFn: getTokens,
  mutationKey: authKeys.tokens,
})