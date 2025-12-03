// User basic info (from user service DB only)
export interface UserBasicInfo {
  id: string
  keycloak_id: string
  display_name: string | null
  profile_picture: string | null
  description: string | null
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
  id: string
  user_id: string
  theme: string
  lang: string
  created_at: string
  updated_at: string
}

// Request types
export interface UpdateUserRequest {
  display_name?: string | null
  profile_picture?: string | null
  description?: string | null
}

export interface UpdateSettingRequest {
  theme?: string
  lang?: string
}

// Query params
export interface FullInfoQuery {
  full_info?: boolean
}
