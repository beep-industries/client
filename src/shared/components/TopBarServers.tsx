import { Search, User } from "lucide-react"
import TopBar from "./TopBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"
import { Button } from "./ui/Button"
import { useTranslation } from "react-i18next"
import { cn } from "@/shared/lib/utils"

interface TopBarServersProps {
  onToggleMembers: () => void
  onToggleSearch: () => void
  showSearch: boolean
  showMembers: boolean
  isTextChannel?: boolean
}

export default function TopBarServers({
  onToggleMembers,
  onToggleSearch,
  showSearch,
  showMembers,
  isTextChannel,
}: TopBarServersProps) {
  const { t } = useTranslation()

  return (
    <TopBar>
      <div className="flex w-full justify-end gap-2">
        {/** Conditionally render search button if in a text channel */}
        {typeof isTextChannel !== "undefined" && isTextChannel && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("size-7", showSearch && "bg-accent")}
                onClick={onToggleSearch}
              >
                <Search />
                <span className="sr-only">{t("topBar.search")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("topBar.search")}</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-7", showMembers && "bg-accent")}
              onClick={onToggleMembers}
            >
              <User />
              <span className="sr-only">{t("topBar.show_users")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("topBar.show_users")}</TooltipContent>
        </Tooltip>
      </div>
    </TopBar>
  )
}
