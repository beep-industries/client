import { communities_api } from "@/shared/lib/api"
import type { GetAllFriendsRequest, GetAllFriendsResponse } from "./friend.types"

export const getAllFriends = (content: GetAllFriendsRequest) =>
  communities_api
    .get("friends", { searchParams: content.query, method: "GET" })
    .json<GetAllFriendsResponse>()
