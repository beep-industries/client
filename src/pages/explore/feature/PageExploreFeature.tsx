import { useEffect, useState } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { useDocumentTitle } from "@/hooks/use-document-title"
import {
  useSearchServersPage,
  useDiscoverServersPage,
} from "@/shared/queries/community/community.queries"
import { MAXIMUM_SERVERS_PER_API_CALL } from "@/shared/constants/community.contants"
import PageExplore from "../ui/PageExplore"

export default function PageExploreFeature() {
  const { setHeader, setContent } = useSidebarContent()
  useDocumentTitle("Explore")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const discoverQuery = useDiscoverServersPage(currentPage)
  const searchServersQuery = useSearchServersPage(searchQuery, currentPage)

  const activeQuery = searchQuery.trim() ? searchServersQuery : discoverQuery
  const servers = activeQuery.data?.data ?? []
  const totalPages = activeQuery.data
    ? Math.ceil(activeQuery.data.total / MAXIMUM_SERVERS_PER_API_CALL)
    : 1

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    setHeader(null)
    setContent(null)
    return () => {
      setHeader(null)
      setContent(null)
    }
  }, [setHeader, setContent])

  return (
    <PageExplore
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      servers={servers}
      isLoading={activeQuery.isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      isFetching={activeQuery.isFetching}
    />
  )
}
