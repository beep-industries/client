import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import {
  Grid2X2,
  LayoutGrid,
  Presentation,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
  Users,
} from "lucide-react"
import type { LayoutType } from "@/pages/channel/types"

interface VideoConferenceTopBarProps {
  iceStatus: string
  channelStatus: string | null
  participantCount: number
  layout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
}

export function VideoConferenceTopBar({
  iceStatus,
  participantCount,
  layout,
  onLayoutChange,
}: VideoConferenceTopBarProps) {
  const { t } = useTranslation()

  const getConnectionIcon = () => {
    switch (iceStatus) {
      case "connected":
      case "completed":
        return <SignalHigh className="size-4 text-green-500" />
      case "checking":
        return <Signal className="size-4 animate-pulse text-yellow-500" />
      case "disconnected":
        return <SignalLow className="size-4 text-orange-500" />
      case "failed":
      case "closed":
        return <SignalZero className="size-4 text-red-500" />
      default:
        return <Signal className="text-muted-foreground size-4" />
    }
  }

  const getLayoutLabel = () => {
    switch (layout) {
      case "grid":
        return t("videoConference.layout.grid")
      case "spotlight":
        return t("videoConference.layout.spotlight")
      case "sidebar":
        return t("videoConference.layout.sidebar")
    }
  }

  return (
    <div className="bg-card/50 flex items-center justify-between border-b px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-sm font-medium capitalize">{iceStatus}</span>
        </div>
        <div className="bg-border h-4 w-px" />
        <div className="text-muted-foreground flex items-center gap-2">
          <Users className="size-4" />
          <span className="text-sm">
            {participantCount}{" "}
            {participantCount !== 1
              ? t("videoConference.participants_plural")
              : t("videoConference.participants")}
          </span>
        </div>
      </div>

      {/* Layout Controls */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {layout === "grid" && <Grid2X2 className="size-4" />}
              {layout === "spotlight" && <Presentation className="size-4" />}
              {layout === "sidebar" && <LayoutGrid className="size-4" />}
              <span>{getLayoutLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onLayoutChange("grid")} className="gap-2">
              <Grid2X2 className="size-4" />
              {t("videoConference.layout.grid")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLayoutChange("spotlight")} className="gap-2">
              <Presentation className="size-4" />
              {t("videoConference.layout.spotlight")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLayoutChange("sidebar")} className="gap-2">
              <LayoutGrid className="size-4" />
              {t("videoConference.layout.sidebar")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
