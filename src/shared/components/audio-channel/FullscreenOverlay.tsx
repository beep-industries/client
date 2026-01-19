import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip"
import {
  Mic,
  MicOff,
  Minimize2,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { VideoStream } from "./VideoStream"
import { AudioStream } from "./AudioStream"
import type { ParticipantStream } from "../types"

interface FullscreenOverlayProps {
  participant: ParticipantStream
  isCurrentUser: boolean
  isMuted: boolean
  onMute: () => void
  onClose: () => void
}

export function FullscreenOverlay({
  participant,
  isCurrentUser,
  isMuted,
  onMute,
  onClose,
}: FullscreenOverlayProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full">
        {participant.video && participant.tracks.video ? (
          <VideoStream stream={participant.tracks.video} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Avatar className="size-32">
              <AvatarImage
                src={participant.user.profile_picture}
                alt={participant.user.display_name}
              />
              <AvatarFallback className="text-4xl">
                {participant.user.display_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xl text-white">
              {participant.user.display_name}
              {isCurrentUser && ` ${t("videoConference.status.you")}`}
            </span>
            <span className="text-muted-foreground">{t("videoConference.status.camera_off")}</span>
          </div>
        )}

        {/* Audio for fullscreen - skip for current user */}
        {!isCurrentUser && participant.audio && participant.tracks.audio && (
          <AudioStream stream={participant.tracks.audio} muted={isMuted} />
        )}

        {/* Fullscreen Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Mute button - only for other users */}
          {!isCurrentUser && participant.audio && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "bg-black/50 text-white hover:bg-black/70",
                    isMuted && "bg-red-500/70 hover:bg-red-500/90"
                  )}
                  onClick={onMute}
                >
                  {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isMuted
                  ? t("videoConference.controls.unmute")
                  : t("videoConference.controls.mute")}
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={onClose}
              >
                <Minimize2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("videoConference.controls.exit_fullscreen")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={onClose}
              >
                <X className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("videoConference.controls.close")}</TooltipContent>
          </Tooltip>
        </div>

        {/* Bottom info bar in fullscreen */}
        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage
                src={participant.user.profile_picture}
                alt={participant.user.display_name}
              />
              <AvatarFallback>
                {participant.user.display_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium text-white">
              {participant.user.display_name}
              {isCurrentUser && ` ${t("videoConference.status.you")}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Audio status - for current user show mic state, for others show mute state */}
            {isCurrentUser ? (
              participant.audio ? (
                <Mic className="size-5 text-white" />
              ) : (
                <MicOff className="size-5 text-red-400" />
              )
            ) : isMuted ? (
              <VolumeX className="size-5 text-red-400" />
            ) : participant.audio ? (
              <Mic className="size-5 text-white" />
            ) : (
              <MicOff className="size-5 text-red-400" />
            )}
            {participant.video ? (
              <VideoIcon className="size-5 text-white" />
            ) : (
              <VideoOff className="size-5 text-red-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
