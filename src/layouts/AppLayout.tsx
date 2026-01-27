import { AppSidebar } from "@/shared/components/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/Sidebar"
import { Outlet } from "@tanstack/react-router"
import ServerNav from "@/shared/components/ServerNav"
import { RealTimeSocketProvider } from "@/app/providers/RealTimeSocketProvider.tsx"
import { WebRTCProvider } from "@/app/providers/WebRTCProvider.tsx"
import { RoleProvider } from "@/app/providers/RoleProvider"

export default function AppLayout() {
  return (
    <RealTimeSocketProvider>
      <WebRTCProvider>
        <div className="flex h-screen w-screen">
          <RoleProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex-1 overflow-auto">
                <Outlet />
              </SidebarInset>
              <ServerNav />
            </SidebarProvider>
          </RoleProvider>
        </div>
      </WebRTCProvider>
    </RealTimeSocketProvider>
  )
}
