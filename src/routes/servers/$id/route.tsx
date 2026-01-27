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
import { ChannelTypeProvider, useChannelType } from "@/shared/components/ChannelTypeContext"
import SearchSidebar from "@/shared/components/SearchSidebar"

export const Route = createFileRoute("/servers/$id")({
  component: (props) => (
    <ChannelTypeProvider>
      <ServerLayout {...props} />
    </ChannelTypeProvider>
  ),
})

function ServerLayout() {
  const { id } = Route.useParams()
  const { setHeader, setContent } = useSidebarContent()
  const { data: server } = useServerById(id)
  const {
    data: membersData,
    isLoading: isMembersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServerMembers(id)
  const [sideBar, setSideBar] = useState<"search" | "members" | null>(null)
  const { channelType } = useChannelType()

  useDocumentTitle(server?.name)

  // Get all unique user IDs from all pages
  const userIds = useMemo(() => {
    if (!membersData?.pages) return []
    const ids = membersData.pages.flatMap((page) => page.data.map((member) => member.user_id))
    return ids
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
        const displayName = member.nickname ?? user?.display_name ?? member.user_id
        return {
          id: member.user_id,
          username: displayName,
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
        onToggleMembers={() => setSideBar((prev) => (prev === "members" ? null : "members"))}
        onToggleSearch={() => setSideBar((prev) => (prev === "search" ? null : "search"))}
        showMembers={sideBar === "members"}
        showSearch={sideBar === "search"}
        isTextChannel={channelType === "ServerText"}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <MembersSidebar
          open={sideBar === "members"}
          members={members}
          isLoading={isUsersLoading || isMembersLoading}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isFetchingMore={isFetchingNextPage}
        />
        <SearchSidebar open={sideBar === "search"} />
      </div>
    </>
  )
}
