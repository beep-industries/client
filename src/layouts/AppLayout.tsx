import NavServer from "@/components/nav-server"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/Sidebar"
import { Outlet } from "@tanstack/react-router"

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen bg-red-500">
      <SidebarProvider>
        {/* LEFT SECTION - Navigation principale */}

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
