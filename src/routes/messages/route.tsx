import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { FriendNav } from "@/shared/components/FriendNav"
import TopBar from "@/shared/components/TopBar"
import FriendsList from "@/shared/components/FriendsList"
import { useFriends } from "@/shared/queries/community/community.queries"

export const Route = createFileRoute("/messages")({
  component: MessagesLayout,
})

function MessagesLayout() {
  const { setHeader, setContent } = useSidebarContent()

  const { data: friends } = useFriends()

  useEffect(() => {
    setHeader(<FriendNav />)
    setContent(<FriendsList friends={friends?.pages.flatMap((page) => page.data) ?? []} />)
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent, friends])

  return (
    <>
      <TopBar />
      <Outlet />
    </>
  )
}
