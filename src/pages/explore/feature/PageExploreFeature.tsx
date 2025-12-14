import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import PageExplore from "../ui/PageExplore"

function ExploreSidebarHeader() {
  return <h2 className="text-lg font-semibold">Explore</h2>
}

function ExploreSidebarContent() {
  return (
    <div className="flex flex-col gap-2">
      <button className="hover:bg-accent rounded-md px-3 py-2 text-left text-sm">
        Discover servers
      </button>
      <button className="hover:bg-accent rounded-md px-3 py-2 text-left text-sm">
        Popular communities
      </button>
      <button className="hover:bg-accent rounded-md px-3 py-2 text-left text-sm">Gaming</button>
    </div>
  )
}

export default function PageExploreFeature() {
  const { setHeader, setContent } = useSidebarContent()

  useEffect(() => {
    setHeader(<ExploreSidebarHeader />)
    setContent(<ExploreSidebarContent />)
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent])

  return <PageExplore />
}
