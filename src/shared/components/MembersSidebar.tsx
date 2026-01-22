import { useTranslation } from "react-i18next"
import { cn } from "@/shared/lib/utils"
import { SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/Sidebar"
import { ChevronDown, Loader2 } from "lucide-react"
import Member from "./Member"
import { Skeleton } from "./ui/Skeleton"
import type { MemberData } from "./MemberDialog"
import { useRef, useCallback, useEffect, useMemo } from "react"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider.tsx"
import { useParams } from "@tanstack/react-router"

interface MembersSidebarProps {
  open: boolean
  members: MemberData[]
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  isFetchingMore?: boolean
}

function MemberSkeleton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="h-4 w-24" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function MembersSidebar({
  open,
  members,
  isLoading,
  onLoadMore,
  hasMore,
  isFetchingMore,
}: MembersSidebarProps) {
  const { t } = useTranslation()
  const { id } = useParams({ strict: false }) as { id?: string }
  const { presences } = useRealTimeSocket()
  const updatedMembers = useMemo(
    () =>
      members.map(
        (member) =>
          ({
            ...member,
            status: presences["server:" + id]?.find(
              (presence) => presence.metas[0]?.user_id === member.id
            )
              ? "online"
              : "offline",
          }) as MemberData
      ),
    [id, members, presences]
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isFetchingMore && onLoadMore) {
        onLoadMore()
      }
    },
    [hasMore, isFetchingMore, onLoadMore]
  )

  useEffect(() => {
    const element = observerTarget.current
    const container = scrollContainerRef.current
    if (!element || !container) return

    const observer = new IntersectionObserver(handleObserver, {
      root: container,
      threshold: 0.1,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <aside
      className={cn(
        "bg-sidebar shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
        open ? "w-60 border-l" : "w-0"
      )}
    >
      <div className="flex h-full w-60 flex-col">
        <SidebarGroupLabel className="flex items-center gap-2 p-2 font-semibold">
          <ChevronDown className="size-3!" />
          <span>{t("topBar.members")}</span>
          <span className="text-muted-foreground/80">{isLoading ? "..." : members.length}</span>
        </SidebarGroupLabel>
        <div className="flex-1 overflow-auto px-2" ref={scrollContainerRef}>
          <SidebarMenu>
            {isLoading ? (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <MemberSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {updatedMembers.map((member) => (
                  <Member key={member.id} member={member} />
                ))}
                {hasMore && (
                  <div ref={observerTarget} className="py-2">
                    {isFetchingMore && (
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Loader2 className="size-4 animate-spin" />
                          <span className="text-muted-foreground text-sm">Loading more...</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </div>
                )}
              </>
            )}
          </SidebarMenu>
        </div>
      </div>
    </aside>
  )
}
