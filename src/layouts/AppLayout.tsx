import { AppSidebar } from "@/shared/components/AppSidebar"
import { SidebarInset, SidebarProvider, useSidebar } from "@/shared/components/ui/Sidebar"
import { Outlet } from "@tanstack/react-router"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import ServerNav from "@/shared/components/ServerNav"

function SidebarTrigger() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="size-7">
      {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <SidebarProvider>
        {/* LEFT SECTION - Navigation principale */}
        <AppSidebar />

        {/* MIDDLE SECTION - Contenu principal */}
        <SidebarInset className="flex-1 overflow-auto">
          <div className="bg-sidebar border-sidebar-border border-b p-2">
            <SidebarTrigger />
          </div>
          <div className="p-2">
            <Outlet />
          </div>
        </SidebarInset>

        {/* RIGHT SECTION - Navigation serveurs */}
        <ServerNav />
      </SidebarProvider>
    </div>
  )
}
