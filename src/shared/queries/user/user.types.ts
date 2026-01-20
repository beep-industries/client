// User basic info (from user service DB only)
export interface UserBasicInfo {
  sub: string
  display_name: string
  profile_picture: string
  description: string
}

// User full info (includes Keycloak data)
export interface UserFullInfo extends UserBasicInfo {
  username: string
  email: string
}

// User settings
export interface UserSettings {
  sub: string
  theme: string
  lang: string
  created_at: string
  updated_at: string
}

// Request types
export interface UpdateUserRequest {
  display_name?: string
  profile_picture?: string
  description?: string
}

export interface UpdateUserSettingsRequest {
  theme?: string
  lang?: string
}

// Query params
export interface FullInfoQuery {
  full_info?: boolean
}
