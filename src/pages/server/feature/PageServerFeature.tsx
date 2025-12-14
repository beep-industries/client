import { useEffect } from "react"
import { useParams } from "@tanstack/react-router"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import PageServer from "../ui/PageServer"
import { ServerProfile } from "@/shared/components/ServerProfile"

interface Server {
  id: number
  name: string
  image: string | null
}

// Mock data - will be replaced with actual data fetching
const mockServers: Server[] = [
  { id: 1, name: "General", image: null },
  { id: 2, name: "Gaming", image: null },
  { id: 3, name: "Music", image: null },
  { id: 4, name: "Development", image: null },
]

export default function PageServerFeature() {
  const { id } = useParams({ from: "/servers/$id" })
  const { setHeader, setContent } = useSidebarContent()

  const server = mockServers.find((s) => s.id === Number(id))

  useEffect(() => {
    if (server) {
      setHeader(<ServerProfile server={server} />)
    }
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent, server])

  return <PageServer id={id} />
}
