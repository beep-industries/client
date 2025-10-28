import { api } from "@/shared/api/client"
import type { GetTokensRequest, GetTokensResponse, RefreshTokensResponse } from "./auth.types"

export const getTokens = (body: GetTokensRequest) =>
  api.post<GetTokensRequest>("authentication/signin", { json: body }).json<GetTokensResponse>()

export const revokeAuthCookies = () => api.post("authentication/logout").json<void>()

export const refreshTokens = () => api.post("authentication/refresh").json<RefreshTokensResponse>()
