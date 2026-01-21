import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip"
import {
  Maximize2,
  Mic,
  MicOff,
  MoreVertical,
  Pin,
  PinOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { VideoStream } from "./VideoStream"
import { AudioStream } from "./AudioStream"
import type { ParticipantStream } from "@/pages/channel/types"

interface ParticipantCardProps {
  participant: ParticipantStream
  isSpotlight?: boolean
  isThumbnail?: boolean
  isPinned?: boolean
  isMuted?: boolean
  isCurrentUser?: boolean
  onPin?: () => void
  onMute?: () => void
  onFullscreen?: () => void
}

export function ParticipantCard({
  participant,
  isSpotlight,
  isThumbnail,
  isPinned,
  isMuted,
  isCurrentUser,
  onPin,
  onMute,
  onFullscreen,
}: ParticipantCardProps) {
  const { t } = useTranslation()
  const { user, tracks, video, audio } = participant

  // For current user, don't show audio-related controls
  const showAudioControls = !isCurrentUser && audio

  return (
    <div
      className={cn(
        "bg-card group relative h-full overflow-hidden rounded-xl border",
        isSpotlight && "shadow-lg",
        isPinned && "ring-primary ring-2"
      )}
    >
      {/* Video or Avatar Placeholder */}
      <div className="bg-muted absolute inset-0 flex items-center justify-center">
        {video && tracks.video ? (
          <VideoStream stream={tracks.video} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Avatar className={cn(isSpotlight ? "size-24" : isThumbnail ? "size-12" : "size-16")}>
              <AvatarImage src={user.profile_picture} alt={user.display_name} />
              <AvatarFallback className={cn(isSpotlight ? "text-3xl" : "text-lg")}>
                {user.display_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isThumbnail && (
              <span className="text-muted-foreground text-sm">
                {t("videoConference.status.camera_off")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Audio element (hidden) - with mute support, skip for current user */}
      {!isCurrentUser && audio && tracks.audio && (
        <AudioStream stream={tracks.audio} muted={isMuted} />
      )}

      {/* Muted indicator overlay - only show for other users */}
      {!isCurrentUser && isMuted && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-red-500/80 px-2 py-1">
          <VolumeX className="size-3 text-white" />
          <span className="text-xs text-white">{t("videoConference.status.muted")}</span>
        </div>
      )}

      {/* Overlay Controls */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
          "opacity-0 transition-opacity group-hover:opacity-100"
        )}
      />

      {/* Top-right actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Mute button - only for other users */}
        {showAudioControls && onMute && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "bg-black/50 text-white hover:bg-black/70",
                  isMuted && "bg-red-500/70 hover:bg-red-500/90"
                )}
                onClick={onMute}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isMuted ? t("videoConference.controls.unmute") : t("videoConference.controls.mute")}
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={onPin}
            >
              {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isPinned ? t("videoConference.controls.unpin") : t("videoConference.controls.pin")}
          </TooltipContent>
        </Tooltip>

        {onFullscreen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={onFullscreen}
              >
                <Maximize2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("videoConference.controls.fullscreen")}</TooltipContent>
          </Tooltip>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPin}>
              {isPinned ? <PinOff className="mr-2 size-4" /> : <Pin className="mr-2 size-4" />}
              {isPinned
                ? t("videoConference.controls.unpin")
                : t("videoConference.controls.pin_to_spotlight")}
            </DropdownMenuItem>
            {showAudioControls && onMute && (
              <DropdownMenuItem onClick={onMute}>
                {isMuted ? (
                  <Volume2 className="mr-2 size-4" />
                ) : (
                  <VolumeX className="mr-2 size-4" />
                )}
                {isMuted
                  ? t("videoConference.controls.unmute")
                  : t("videoConference.controls.mute")}
              </DropdownMenuItem>
            )}
            {onFullscreen && (
              <DropdownMenuItem onClick={onFullscreen}>
                <Maximize2 className="mr-2 size-4" />
                {t("videoConference.controls.fullscreen")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom info bar */}
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 flex items-center justify-between p-2",
          "bg-gradient-to-t from-black/70 to-transparent"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn("truncate font-medium text-white", isThumbnail ? "text-xs" : "text-sm")}
          >
            {user.display_name}
            {isCurrentUser && ` ${t("videoConference.status.you")}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Audio status - for current user just show their mic state, for others show mute state */}
          {isCurrentUser ? (
            audio ? (
              <Mic className={cn("text-white", isThumbnail ? "size-3" : "size-4")} />
            ) : (
              <MicOff className={cn("text-red-400", isThumbnail ? "size-3" : "size-4")} />
            )
          ) : isMuted ? (
            <VolumeX className={cn("text-red-400", isThumbnail ? "size-3" : "size-4")} />
          ) : audio ? (
            <Mic className={cn("text-white", isThumbnail ? "size-3" : "size-4")} />
          ) : (
            <MicOff className={cn("text-red-400", isThumbnail ? "size-3" : "size-4")} />
          )}
          {video ? (
            <VideoIcon className={cn("text-white", isThumbnail ? "size-3" : "size-4")} />
          ) : (
            <VideoOff className={cn("text-red-400", isThumbnail ? "size-3" : "size-4")} />
          )}
        </div>
      </div>

      {/* Speaking indicator - only for other users when not muted */}
      {!isCurrentUser && audio && !isMuted && (
        <div className="absolute top-2 left-2">
          <div className="size-2 animate-pulse rounded-full bg-green-500" />
        </div>
      )}
    </div>
  )
}
