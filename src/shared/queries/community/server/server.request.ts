export interface CreateServerRequest {
  name: string
  picture_url?: string
  banner_url?: string
  description?: string
  visibility: "Public" | "Private"
}

export interface UpdateServerRequest {
  name?: string
  picture_url?: string
  banner_url?: string
  description?: string
  visibility?: "Public" | "Private"
}

export type ExpirationOption = "one_day" | "one_week" | "one_month"

export interface CreateServerInvitation {
  server_id: string
  expire_in: ExpirationOption
}

export interface ExpirationPayload {
  expires_at: string
}

export const computeExpiration = (expiration: ExpirationOption): ExpirationPayload => {
  const now = new Date()

  switch (expiration) {
    case "one_day":
      now.setUTCDate(now.getUTCDate() + 1)
      break
    case "one_week":
      now.setUTCDate(now.getUTCDate() + 7)
      break
    case "one_month":
      now.setUTCMonth(now.getUTCMonth() + 1)
      break
  }

  return { expires_at: now.toISOString() }
}
