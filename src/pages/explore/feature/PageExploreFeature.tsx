import { useEffect } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { useDocumentTitle } from "@/hooks/use-document-title"
import PageExplore from "../ui/PageExplore"

export default function PageExploreFeature() {
  const { setHeader, setContent } = useSidebarContent()
  useDocumentTitle("Explore")

  useEffect(() => {
    setHeader(null)
    setContent(null)
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent])

  return <PageExplore />
}
