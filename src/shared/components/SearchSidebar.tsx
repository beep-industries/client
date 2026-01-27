import { useParams } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "../lib/utils"
import { useSearchMessage } from "../queries/message/message.queries"
import { Input } from "./ui/Input"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/Sidebar"
import SearchMessage from "./SearchMessage"

interface SearchSidebarProps {
  open: boolean
}

export default function SearchSidebar({ open }: SearchSidebarProps) {
  const { t } = useTranslation()
  const { channelId } = useParams({ strict: false }) as { channelId?: string }
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState("")
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    isSuccess,
    error,
  } = useSearchMessage(channelId || "", search)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    setSearch("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [channelId])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // Combine all pages of results
  const messages = data?.pages.flatMap((page) => page.data) || []

  return (
    <aside
      className={cn(
        "bg-sidebar shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
        open ? "w-60 border-l" : "w-0"
      )}
    >
      <div className="flex h-full w-60 flex-col">
        <div className="flex-1 overflow-auto px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Input
                type="text"
                placeholder={t("searchSidebar.search_placeholder") || "Search..."}
                className="my-2 w-full focus:ring-0! focus:outline-none!"
                ref={inputRef}
                value={search}
                onChange={handleInput}
              />
            </SidebarMenuItem>
            {isLoading && (
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    {t("searchSidebar.loading") || "Loading..."}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {isError && (
              <SidebarMenuItem>
                <span className="text-destructive text-sm">
                  {error instanceof Error ? error.message : "Error"}
                </span>
              </SidebarMenuItem>
            )}
            {isSuccess && !isLoading && messages.length === 0 && (
              <SidebarMenuItem className="flex justify-center">
                <span className="text-muted-foreground text-sm">
                  {t("searchSidebar.no_results") || "No results found."}
                </span>
              </SidebarMenuItem>
            )}
            {messages.map((msg) => (
              <SidebarMenuItem
                key={msg._id}
                onClick={() => {
                  const el = document.querySelector(`[data-message-id='${msg._id}']`)
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" })
                    el.classList.add("background", "bg-primary/10")
                    setTimeout(() => {
                      el.classList.remove("background", "bg-primary/10")
                    }, 1500)
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <SearchMessage message={msg} />
              </SidebarMenuItem>
            ))}
            {hasNextPage && !isLoading && (
              <SidebarMenuItem className="mb-3">
                <SidebarMenuButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : null}
                  <span className="text-muted-foreground text-sm font-bold">
                    {t("searchSidebar.load_more") || "Load more..."}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      </div>
    </aside>
  )
}
