import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "./ui/Button"
import { useSidebar } from "./ui/Sidebar"

export default function SidebarTrigger() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="size-7">
      {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
