import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { FriendNav } from "@/shared/components/FriendNav"
import FriendsList, { type Friend } from "@/shared/components/FriendsList"
import TopBar from "@/shared/components/TopBar"
import { useDocumentTitle } from "@/hooks/use-document-title"

export const Route = createFileRoute("/messages")({
  component: MessagesLayout,
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

function MessagesLayout() {
  const { setHeader, setContent } = useSidebarContent()
  useDocumentTitle("Messages")
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
      <TopBar />
      <Outlet />
    </>
  )
}
