import type { Friend as FriendType } from "../queries/community/community.types"
import Friend from "./Friend"

interface FriendsListProps {
  friends: FriendType[]
}

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <>
      {friends.map((friend: FriendType) => (
        <Friend
          key={`${friend.user_id_1}-${friend.user_id_2}`}
          id={`${friend.user_id_1}-${friend.user_id_2}`}
          name={"Beep"}
          avatar="https://beep-image.baptistebronsin.be/logo.png"
        />
      ))}
    </>
  )
}
