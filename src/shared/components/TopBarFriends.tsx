import { useTranslation } from "react-i18next"
import TopBar from "./TopBar"
import { Button } from "./ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"
import { UserPlus } from "lucide-react"

export default function TopBarFriends() {
  const { t } = useTranslation()

  return (
    <TopBar>
      <div className="flex w-full justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <UserPlus />
              <span className="sr-only">{t("topBar.add_friends")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("topBar.add_friends")}</TooltipContent>
        </Tooltip>
      </div>
    </TopBar>
  )
}
