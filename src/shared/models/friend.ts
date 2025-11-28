export interface Friend {
  user_id_1: string
  user_id_2: string

  created_at: string
}

export interface FriendRequest {
  user_id_requested: string
  user_id_invited: string
  status: number

  created_at: string
}
