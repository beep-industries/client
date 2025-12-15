import { Bell, User } from "lucide-react"
import { useLocation } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"
import SidebarTrigger from "./SidebarTrigger"

export default function TopBar() {
  const location = useLocation()
  const { t } = useTranslation()
  const showUsersButton = location.pathname.startsWith("/servers")

  return (
    <div className="bg-sidebar border-sidebar-border flex flex-row justify-between border-b p-2">
      <SidebarTrigger />
      <div className="flex flex-row gap-2">
        {showUsersButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <User />
                <span className="sr-only">{t("topBar.show_users")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("topBar.show_users")}</TooltipContent>
          </Tooltip>
        )}
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
    </div>
  )
}
