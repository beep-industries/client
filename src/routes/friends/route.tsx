import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { FriendNav } from "@/shared/components/FriendNav"
import TopBarFriends from "@/shared/components/TopBarFriends"

export const Route = createFileRoute("/friends")({
  component: FriendsPage,
})

function FriendsPage() {
  const { setHeader, setContent } = useSidebarContent()

  useEffect(() => {
    setHeader(<FriendNav />)
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
