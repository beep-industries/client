import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useState, useMemo } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { ServerProfile } from "@/shared/components/ServerProfile"
import ServerChannels from "@/shared/components/ServerChannels"
import { useServerById, useServerMembers } from "@/shared/queries/community/community.queries"
import TopBarServers from "@/shared/components/TopBarServers"
import MembersSidebar from "@/shared/components/MembersSidebar"
import type { MemberData } from "@/shared/components/MemberDialog"
import { useDocumentTitle } from "@/hooks/use-document-title"

export const Route = createFileRoute("/servers/$id")({
  component: ServerLayout,
})

function ServerLayout() {
  const { id } = Route.useParams()
  const { setHeader, setContent } = useSidebarContent()
  const { data: server } = useServerById(id)
  const {
    data: membersData,
    isLoading: isMembersLoading,
    // fetchNextPage,
    // hasNextPage,
  } = useServerMembers(id)
  const [showMembers, setShowMembers] = useState(false)

  useDocumentTitle(server?.name)

  const members: MemberData[] = useMemo(() => {
    if (!membersData?.pages) return []

    return membersData.pages.flatMap((page) =>
      page.data.map((member) => ({
        id: member.user_id,
        username: member.nickname || member.user_id,
        avatar_url: undefined,
        status: undefined,
        description: undefined,
      }))
    )
  }, [membersData])

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
        <MembersSidebar open={showMembers} members={members} isLoading={isMembersLoading} />
      </div>
    </>
  )
}
