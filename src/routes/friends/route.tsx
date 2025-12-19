import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { FriendNav } from "@/shared/components/FriendNav"
import type { Friend } from "@/shared/components/FriendsList"
import FriendsList from "@/shared/components/FriendsList"
import TopBarFriends from "@/shared/components/TopBarFriends"

export const Route = createFileRoute("/friends")({
  component: FriendsPage,
})

const friendsMock: Friend[] = [
  {
    id: "1",
    name: "Alice",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Bob",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Charlie",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
]

function FriendsPage() {
  const { setHeader, setContent } = useSidebarContent()
  useEffect(() => {
    setHeader(<FriendNav />)
    setContent(<FriendsList friends={friendsMock} />)
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent])

  return (
    <>
      <TopBarFriends />
      <Outlet />
    </>
  )
}
