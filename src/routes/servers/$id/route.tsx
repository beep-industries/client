import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { ServerProfile } from "@/shared/components/ServerProfile"
import ServerChannels from "@/shared/components/ServerChannels"
import { useServerById } from "@/shared/queries/community/community.queries"
import TopBarServers from "@/shared/components/TopBarServers"
import MembersSidebar from "@/shared/components/MembersSidebar"
import type { MemberData } from "@/shared/components/Member"

export const Route = createFileRoute("/servers/$id")({
  component: ServerLayout,
})

// Mock data for testing
const mockMembers: MemberData[] = [
  {
    id: "1",
    username: "Alice",
    avatar_url: undefined,
    status: "online",
    description: "Hello, I'm Alice!",
  },
  {
    id: "2",
    username: "Bob",
    avatar_url: undefined,
    status: "online",
    description: "Just chilling",
  },
  { id: "3", username: "Charlie", avatar_url: undefined, status: "idle" },
  {
    id: "4",
    username: "Diana",
    avatar_url: undefined,
    status: "dnd",
    description: "Do not disturb, working",
  },
  { id: "5", username: "Eve", avatar_url: undefined, status: "offline" },
  {
    id: "6",
    username: "Frank",
    avatar_url: undefined,
    status: "online",
    description: "Gaming 24/7",
  },
  { id: "7", username: "Grace", avatar_url: undefined, status: "offline" },
  { id: "8", username: "Henry", avatar_url: undefined, status: "online" },
]

function ServerLayout() {
  const { id } = Route.useParams()
  const { setHeader, setContent } = useSidebarContent()
  const { data: server } = useServerById(id)
  const [showMembers, setShowMembers] = useState(false)

  useEffect(() => {
    if (server) {
      setHeader(<ServerProfile server={server} />)
      setContent(<ServerChannels serverId={id} />)
    }
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent, server, id])

  return (
    <>
      <TopBarServers
        onToggleMembers={() => setShowMembers((prev) => !prev)}
        showMembers={showMembers}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <MembersSidebar open={showMembers} members={mockMembers} />
      </div>
    </>
  )
}
