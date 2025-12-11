import { AppSidebar } from "@/shared/components/AppSidebar"
import NavServer from "@/shared/components/NavServer"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/Sidebar"
import { Outlet } from "@tanstack/react-router"

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <SidebarProvider>
        {/* LEFT SECTION - Navigation principale */}
        <AppSidebar />

        {/* MIDDLE SECTION - Contenu principal */}
        <SidebarInset className="flex-1 overflow-auto p-6 pt-8">
          <Outlet />
        </SidebarInset>

        {/* RIGHT SECTION - Navigation serveurs */}
        <NavServer />
      </SidebarProvider>
    </div>
  )
}
