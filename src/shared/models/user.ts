export interface User {
  id: string
  email: string
  username: string
  profilePicture?: string
  totpAuthentication: boolean
  verifiedAt: Date | null
  createdAt?: string
  updatedAt?: string
}

//needed because of the actual backend to be removed when the backend handles the jwt correctly
export interface JwtUser {
  sub: string
  email: string
  username: string
  profilePicture?: string
  totpAuthentication: boolean
  verifiedAt: Date | null
  createdAt?: string
  updatedAt?: string
}
