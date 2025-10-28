export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  profilePicture?: string
  totpAuthentication: boolean
  verifiedAt: Date | null
  createdAt?: string
  updatedAt?: string
}
