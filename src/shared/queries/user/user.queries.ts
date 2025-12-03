import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCurrentUser,
  updateCurrentUser,
  getCurrentUserSettings,
  updateCurrentUserSettings,
  getUserBySub,
} from "./user.api"
import type { UpdateUserRequest, UpdateUserSettingsRequest } from "./user.types"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  meFullInfo: () => [...userKeys.me(), "full"] as const,
  settings: () => [...userKeys.all, "settings"] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
}

export const useCurrentUser = (fullInfo?: boolean) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: fullInfo ? userKeys.meFullInfo() : userKeys.me(),
    queryFn: () => getCurrentUser(accessToken!, { full_info: fullInfo }),
    enabled: !!accessToken,
  })
}

export const useUpdateCurrentUser = () => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateCurrentUser(accessToken!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export const useCurrentUserSettings = () => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: userKeys.settings(),
    queryFn: () => getCurrentUserSettings(accessToken!),
    enabled: !!accessToken,
  })
}

export const useUpdateCurrentUserSettings = () => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserSettingsRequest) => updateCurrentUserSettings(accessToken!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.settings() })
    },
  })
}

export const useUserBySub = (sub: string) => {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: userKeys.detail(sub),
    queryFn: () => getUserBySub(accessToken!, sub),
    enabled: !!accessToken && !!sub,
  })
}
