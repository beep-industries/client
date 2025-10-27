import { api } from "@/shared/api/client"
import type { GetTokensRequest, GetTokensResponse } from "./auth.types"

export const getTokens = (body: GetTokensRequest) =>
  api.post<GetTokensRequest>("authentication/signin", { json: body }).json<GetTokensResponse>()
