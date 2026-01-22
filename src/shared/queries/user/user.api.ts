import ky from "ky"
import type {
  UserBasicInfo,
  UserFullInfo,
  UpdateUserRequest,
  UserSettings,
  UpdateUserSettingsRequest,
  FullInfoQuery,
} from "./user.types"

const createUserApi = (accessToken: string) =>
  ky.create({
    prefixUrl: import.meta.env.VITE_USER_SERVICE_URL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

// GET /users/me
export const getCurrentUser = (accessToken: string, query?: FullInfoQuery) => {
  const api = createUserApi(accessToken)
  const searchParams = query?.full_info ? { full_info: "true" } : undefined
  return api.get("users/me", { searchParams }).json<UserBasicInfo | UserFullInfo>()
}

// PUT /users/me
export const updateCurrentUser = (accessToken: string, data: UpdateUserRequest) => {
  const api = createUserApi(accessToken)
  return api.put("users/me", { json: data }).json<UserBasicInfo>()
}

// GET /users/me/settings
export const getCurrentUserSettings = (accessToken: string) => {
  const api = createUserApi(accessToken)
  return api.get("users/me/settings").json<UserSettings>()
}

// PUT /users/me/settings
export const updateCurrentUserSettings = (accessToken: string, data: UpdateUserSettingsRequest) => {
  const api = createUserApi(accessToken)
  return api.put("users/me/settings", { json: data }).json<UserSettings>()
}

// GET /users/:sub
export const getUserBySub = (accessToken: string, sub: string) => {
  const api = createUserApi(accessToken)
  return api.get(`users/${sub}`).json<UserBasicInfo>()
}

// POST /users/batch
export const getUsersBatch = (accessToken: string, subs: string[]) => {
  const api = createUserApi(accessToken)
  return api.get("users/bart", { json: { subs } }).json<UserBasicInfo[]>()
}
