// User basic info (from user service DB only)
export interface UserBasicInfo {
  sub: string
  display_name: string
  profile_picture: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

// User full info (includes Keycloak data)
export interface UserFullInfo extends UserBasicInfo {
  username: string
  email: string
  first_name: string
  last_name: string
}

// Settings
export interface Setting {
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

export interface UpdateSettingRequest {
  theme?: string
  lang?: string
}

// Query params
export interface FullInfoQuery {
  full_info?: boolean
}
