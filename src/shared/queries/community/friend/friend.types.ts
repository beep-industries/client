export interface FriendRequest {
  user_id_invited: string
  user_id_requested: string
  status: 0 | 1
  created_at: string
}

export interface FriendInvitation {
  user_id_invited: string
  user_id_requested: string
  status: 0 | 1
  created_at: string
}

export interface Friend {
  user_id_1: string
  user_id_2: string
  created_at: string
}
