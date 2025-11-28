import { useGetAllFriendsQuery } from "@/shared/queries/friend/friend.queries"

export function FriendsFeaturePage() {
  const { data, isLoading, error } = useGetAllFriendsQuery()

  return (
    <div>
      <h1>Friends List</h1>
      {isLoading && <p>Loading friends...</p>}
      {error && <p>Error loading friends: {(error as Error).message}</p>}
      {data && (
        <ul>
          {data.data.map((friend) => (
            <li key={friend.user_id_1 + friend.user_id_2}>
              {friend.user_id_1} - {friend.user_id_2}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
