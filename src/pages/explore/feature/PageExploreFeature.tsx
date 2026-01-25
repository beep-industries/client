import { useEffect, useState } from "react"
import { useSidebarContent } from "@/app/providers/SidebarContentProvider"
import { useDocumentTitle } from "@/hooks/use-document-title"
import {
  useSearchServersPage,
  useDiscoverServersPage,
  useCreateMember,
} from "@/shared/queries/community/community.queries"
import { MAXIMUM_SERVERS_PER_API_CALL } from "@/shared/constants/community.contants"
import PageExplore from "../ui/PageExplore"
import type { Server } from "@/shared/queries/community/community.types.ts"

export default function PageExploreFeature() {
  const { setHeader, setContent } = useSidebarContent()
  useDocumentTitle("Explore")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const { mutateAsync: createMember } = useCreateMember()

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

  function handleServerClick(server: Server) {
    createMember(
      { server_id: server.id },
      {
        onSuccess: () => {
          window.location.href = `/servers/${server.id}`
        },
      }
    )
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
      handleServerClick={(server: Server) => handleServerClick(server)}
    />
  )
}
