import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import PageExplore from "../ui/PageExplore"

function ExploreSidebarHeader() {
  return <div></div>
}

function ExploreSidebarContent() {
  return <div></div>
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
