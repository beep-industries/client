import { Button } from "@/shared/components/ui/Button"
import { MessageSquare, LogOut } from "lucide-react"

const mockServers = [
  { id: 1, name: "General" },
  { id: 2, name: "Gaming" },
  { id: 3, name: "Music" },
  { id: 4, name: "Development" },
]

export default function NavServer() {
  const handleLogout = () => {
    console.log("Logout clicked")
  }

  const handleServerClick = (serverId: number) => {
    console.log("Server clicked:", serverId)
  }

  return (
    <nav className="flex h-screen w-20 flex-col items-center gap-2 bg-gray-900 p-3">
      {/* Carré Messages Privés */}
      <Button size="icon-xl">
        <MessageSquare className="h-10 w-10 text-white" />
      </Button>

      {/* Séparateur */}
      <div className="my-1 h-0.5 w-10 bg-gray-700" />

      {/* Liste des serveurs */}
      <div className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent flex flex-1 flex-col gap-2 overflow-y-auto">
        {mockServers.map((server) => (
          <Button
            key={server.id}
            onClick={() => handleServerClick(server.id)}
            size="icon-xl"
            className="group relative flex items-center justify-center bg-gray-700 transition-all duration-200 hover:bg-indigo-600"
            title={server.name}
          >
            <span className="text-xl text-white">{server.name.charAt(0).toUpperCase()}</span>
          </Button>
        ))}
      </div>

      {/* Séparateur */}
      <div className="my-1 h-0.5 w-10 bg-gray-700" />

      {/* Bouton Logout */}
      <Button
        onClick={handleLogout}
        className="group relative flex items-center justify-center bg-red-600 transition-all duration-200 hover:bg-red-500"
        size="icon-xl"
        title="logout"
      >
        <LogOut className="h-7 w-7 text-white" />
      </Button>
    </nav>
  )
}
