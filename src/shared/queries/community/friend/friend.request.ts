export interface CreateFriendRequestRequest {
  user_pseudo_invited: string
}

export interface AcceptFriendRequestRequest {
  user_id_requested: string
}

export interface DeclineFriendRequestRequest {
  user_id_requested: string
}

export interface DeleteFriendRequestRequest {
  user_id_invited: string
}

export interface DeleteFriendRequest {
  friend_id: string
}
