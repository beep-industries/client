import { useQuery } from "@tanstack/react-query"
import { getAllFriends } from "./friend.api"

export const friendKeys = {
  all: ["friends"] as const,
}

export const useGetAllFriendsQuery = () => {
  return useQuery({
    queryKey: friendKeys.all,
    queryFn: () => getAllFriends({ query: {} }),
  })
}
