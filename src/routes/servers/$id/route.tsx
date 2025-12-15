import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { ServerProfile } from "@/shared/components/ServerProfile"
import ServerChannels from "@/shared/components/ServerChannels"

interface Server {
  id: number
  name: string
  image: string | null
}

// Mock data - will be replaced with actual data fetching
const mockServers: Server[] = [
  { id: 1, name: "General", image: null },
  { id: 2, name: "Gaming", image: null },
  { id: 3, name: "Music", image: null },
  { id: 4, name: "Development", image: null },
]

export const Route = createFileRoute("/servers/$id")({
  component: ServerLayout,
})

function ServerLayout() {
  const { id } = Route.useParams()
  const { setHeader, setContent } = useSidebarContent()

  const server = mockServers.find((s) => s.id === Number(id))

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
