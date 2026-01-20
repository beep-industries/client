import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { FriendNav } from "@/shared/components/FriendNav"
import TopBar from "@/shared/components/TopBar"

export const Route = createFileRoute("/messages")({
  component: MessagesLayout,
})

function MessagesLayout() {
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
      <TopBar />
      <Outlet />
    </>
  )
}
