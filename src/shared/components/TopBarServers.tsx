import { User } from "lucide-react"
import TopBar from "./TopBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"
import { Button } from "./ui/Button"
import { useTranslation } from "react-i18next"

export default function TopBarServers() {
  const { t } = useTranslation()

  return (
    <TopBar>
      <div className="flex w-full justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
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
