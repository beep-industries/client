import type { User } from "@/shared/models/user"

export interface GetTokensResponse {
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: User
}

export interface GetTokensRequest {
    email: string
    password: string
    totpToken?: string
}