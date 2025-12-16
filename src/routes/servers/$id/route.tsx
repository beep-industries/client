import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { ServerProfile } from "@/shared/components/ServerProfile"
import ServerChannels from "@/shared/components/ServerChannels"
import { useServerById } from "@/shared/queries/community/community.queries"

export const Route = createFileRoute("/servers/$id")({
  component: ServerLayout,
})

function ServerLayout() {
  const { id } = Route.useParams()
  const { setHeader, setContent } = useSidebarContent()
  const { data: server } = useServerById(id)

  useEffect(() => {
    if (server) {
      setHeader(<ServerProfile server={server} />)
      setContent(<ServerChannels />)
    }
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent, server])

  return <Outlet />
}
