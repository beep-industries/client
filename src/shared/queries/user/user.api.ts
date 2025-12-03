import ky from "ky"
import type {
  UserBasicInfo,
  UserFullInfo,
  UpdateUserRequest,
  Setting,
  UpdateSettingRequest,
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
  return api.get("users/me/settings").json<Setting>()
}

// PUT /users/me/settings
export const updateCurrentUserSettings = (accessToken: string, data: UpdateSettingRequest) => {
  const api = createUserApi(accessToken)
  return api.put("users/me/settings", { json: data }).json<Setting>()
}

// GET /users/:id
export const getUserById = (accessToken: string, userId: string) => {
  const api = createUserApi(accessToken)
  return api.get(`users/${userId}`).json<UserBasicInfo>()
}
