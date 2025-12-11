import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "./ui/Sidebar"
import { UserMediaControls } from "./UserMediaControls"
import { UserNav } from "./UserNav"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <UserNav
          user={{
            name: "rapidement",
            email: "dodo@gmail.com",
            avatar: "",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <UserMediaControls channelName={"Hey"} />
      </SidebarFooter>
    </Sidebar>
  )
}
