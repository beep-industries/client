import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useState, useMemo } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { ServerProfile } from "@/shared/components/ServerProfile"
import ServerChannels from "@/shared/components/ServerChannels"
import { useServerById, useServerMembers } from "@/shared/queries/community/community.queries"
import { useUsersBatch } from "@/shared/queries/user/user.queries"
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

  // Get all unique user IDs from all pages
  const userIds = useMemo(() => {
    if (!membersData?.pages) return []
    return membersData.pages.flatMap((page) => page.data.map((member) => member.user_id))
  }, [membersData])

  // Fetch user details in batch
  const { data: usersData, isLoading: isUsersLoading } = useUsersBatch(userIds)

  // Combine member data with user details
  const members: MemberData[] = useMemo(() => {
    if (!membersData?.pages || !usersData) return []

    // Create a map of user_id -> user info for quick lookup
    const userMap = new Map(usersData.map((user) => [user.sub, user]))

    return membersData.pages.flatMap((page) =>
      page.data.map((member) => {
        const user = userMap.get(member.user_id)
        return {
          id: member.user_id,
          username: member.nickname || user?.display_name || member.user_id,
          avatar_url: user?.profile_picture,
          status: undefined,
          description: user?.description,
        }
      })
    )
  }, [membersData, usersData])

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
        <MembersSidebar
          open={showMembers}
          members={members}
          isLoading={isMembersLoading || isUsersLoading}
        />
      </div>
    </>
  )
}
