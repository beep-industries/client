import { Link, useLocation } from "@tanstack/react-router"
import { UserRound } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { t } from "i18next"

export function FriendNav() {
  const location = useLocation()
  const isActive = location.pathname === "/friends"

  return (
    <Link
      to={"/friends"}
      className={cn(
        "text-responsive-base! flex w-full items-center justify-start gap-3 rounded-md px-4 py-2 font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <UserRound className={cn("h-4 w-4", isActive && "text-primary")} />
      {t("friends.nav")}
    </Link>
  )
}
