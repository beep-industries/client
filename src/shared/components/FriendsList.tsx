import Friend from "./Friend"

interface FriendsListProps {
  friends: Friend[]
}

export interface Friend {
  id: string
  name: string
  avatarUrl: string
}

export default function FriendsList(friends: FriendsListProps) {
  return (
    <>
      {friends.friends.map((friend: Friend) => (
        <Friend key={friend.id} id={friend.id} name={friend.name} avatar={friend.avatarUrl} />
      ))}
    </>
  )
}
