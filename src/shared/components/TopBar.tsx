import { Bell } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"
import SidebarTrigger from "./SidebarTrigger"

interface TopBarProps {
  children?: React.ReactNode
}

export default function TopBar({ children }: TopBarProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-sidebar border-sidebar-border flex flex-row items-center justify-between gap-2 border-b p-2">
      <SidebarTrigger />
      {children}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7">
            <Bell />
            <span className="sr-only">{t("topBar.notifications")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("topBar.notifications")}</TooltipContent>
      </Tooltip>
    </div>
  )
}
