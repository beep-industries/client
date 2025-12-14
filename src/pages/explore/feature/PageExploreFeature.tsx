import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import PageExplore from "../ui/PageExplore"

function ExploreSidebarContent() {
  return (
    <div className="flex flex-col gap-2 px-2">
      <p className="text-muted-foreground text-sm font-medium">Explore</p>
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
  const { setContent } = useSidebarContent()

  useEffect(() => {
    setContent(<ExploreSidebarContent />)
    return () => setContent(null)
  }, [setContent])

  return <PageExplore />
}
