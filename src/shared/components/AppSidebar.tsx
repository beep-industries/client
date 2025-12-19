import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/Sidebar"
import { UserMediaControls } from "./UserMediaControls"
import { UserNav } from "./UserNav"
import { useCurrentUser } from "@/shared/queries/user/user.queries"
import type { UserFullInfo } from "@/shared/queries/user/user.types"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"

export function AppSidebar() {
  const { data: currentUser } = useCurrentUser(true) as { data: UserFullInfo | undefined }
  const { header: sidebarHeader, content: sidebarContent } = useSidebarContent()

  return (
    <Sidebar>
      <SidebarHeader>{sidebarHeader}</SidebarHeader>
      <SidebarContent className="no-scrollbar px-2">{sidebarContent}</SidebarContent>
      <SidebarFooter>
        <UserMediaControls channelName={"Hey"} isInVoiceChannel={true} />
        <UserNav
          user={{
            name: currentUser?.display_name || currentUser?.username || "",
            email: currentUser?.email ?? "",
            avatar: currentUser?.profile_picture ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
