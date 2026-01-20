import { useAuth } from "@/app/providers/KeycloakAuthProvider"
import FriendRequest from "@/shared/components/FriendRequest"
import { useFriends } from "@/shared/queries/community/community.queries"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/friends/")({
  component: FriendsIndexPage,
})

function FriendsIndexPage() {
  const { data: friends } = useFriends()
  const { user } = useAuth()
  const currentUserId = user?.id

  return (
    <div className="flex flex-col p-4">
      {friends?.pages[0]?.data.map((request) => (
        <FriendRequest
          key={`${request.user_id_1} - ${request.user_id_2}`}
          user_id={request.user_id_1 === currentUserId ? request.user_id_2 : request.user_id_1}
          type="default"
        />
      ))}
    </div>
  )
}
