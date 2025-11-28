import { createFileRoute } from "@tanstack/react-router"
import { FriendsFeaturePage } from "@/features/friends/components/FriendFeaturePage"

export const Route = createFileRoute("/friends")({
  component: FriendsPage,
})

function FriendsPage() {
  return <FriendsFeaturePage />
}
