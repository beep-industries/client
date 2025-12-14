import { AppSidebar } from "@/shared/components/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/Sidebar"
import { Outlet } from "@tanstack/react-router"
import ServerNav from "@/shared/components/ServerNav"

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-auto">
          <Outlet />
        </SidebarInset>
        <ServerNav />
      </SidebarProvider>
    </div>
  )
}
