import { useTranslation } from "react-i18next"
import { cn } from "@/shared/lib/utils"
import { SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/Sidebar"
import { ChevronDown } from "lucide-react"
import Member from "./Member"
import { Skeleton } from "./ui/Skeleton"
import type { MemberData } from "./MemberDialog"

interface MembersSidebarProps {
  open: boolean
  members: MemberData[]
  isLoading?: boolean
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

export default function MembersSidebar({ open, members, isLoading }: MembersSidebarProps) {
  const { t } = useTranslation()

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
        <div className="flex-1 overflow-auto px-2">
          <SidebarMenu>
            {isLoading ? (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <MemberSkeleton key={i} />
                ))}
              </>
            ) : (
              members.map((member) => <Member key={member.id} member={member} />)
            )}
          </SidebarMenu>
        </div>
      </div>
    </aside>
  )
}
