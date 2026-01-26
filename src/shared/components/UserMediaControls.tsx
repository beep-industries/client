import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  SignalHigh,
  Signal,
  SignalLow,
  SignalZero,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/Avatar"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip.tsx"
import { useChannel, useServerById } from "@/shared/queries/community/community.queries.ts"

interface UserMediaControlsProps {
  serverProfileUrl?: string
  channelName: string
  callDuration?: string
  onMicClick?: () => void
  onCameraClick?: () => void
  onHangupClick?: () => void
  isMicActive?: boolean
  isCameraActive?: boolean
  isInVoiceChannel?: boolean
}

export function UserMediaControls({ callDuration }: UserMediaControlsProps) {
  const {
    server,
    session,
    stopCam,
    stopScreenShare,
    screenShareEnabled,
    startScreenShare,
    stopMic,
    camEnabled,
    startCam,
    startMic,
    micEnabled,
    leave,
    joined,
    iceStatus,
  } = useWebRTC()

  const getConnectionIcon = () => {
    switch (iceStatus) {
      case "connected":
      case "completed":
        return <SignalHigh className="size-5 text-green-500" />
      case "checking":
        return <Signal className="size-5 animate-pulse text-yellow-500" />
      case "disconnected":
        return <SignalLow className="size-5 text-orange-500" />
      case "failed":
      case "closed":
        return <SignalZero className="text-primary size-5" />
      default:
        return <Signal className="text-muted-foreground size-5" />
    }
  }

  const { data: currentServer } = useServerById(server || "")
  const { data: channel } = useChannel(session || "")

  return (
    <div className="border-border flex flex-col rounded-lg border">
      {/* Voice channel info - only visible when in a voice channel */}
      {joined && (
        <div className="bg-secondary flex items-center justify-between gap-2 rounded-t-md p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={currentServer?.picture_url || undefined}
                alt={currentServer?.name}
              />
              <AvatarFallback className="bg-background text-foreground rounded-sm">
                {currentServer?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Volume2 className="text-muted-foreground h-4 w-4" />
            <span className="text-foreground text-responsive-md truncate font-bold">
              {channel?.name || ""}
            </span>
          </div>
          <div className="justify-self-end">
            <Tooltip>
              <TooltipTrigger>{getConnectionIcon()}</TooltipTrigger>
              <TooltipContent className="bg-secondary text-foreground text-responsive-md flex items-center gap-2 truncate rounded-t-md p-3 font-bold">
                {iceStatus}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Bottom row: controls */}
      <div
        className={`flex items-center p-3 ${joined ? "justify-between border-t" : "justify-start"}`}
      >
        <div className={`flex gap-3`}>
          <button
            type="button"
            onClick={micEnabled ? stopMic : startMic}
            aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            className={`transition-colors ${micEnabled ? "text-muted-foreground hover:text-foreground" : "text-primary"}`}
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={camEnabled ? stopCam : startCam}
            aria-label={camEnabled ? "Turn off camera" : "Turn on camera"}
            className={`transition-colors ${camEnabled ? "text-muted-foreground hover:text-foreground" : "text-primary"}`}
          >
            {camEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={screenShareEnabled ? stopScreenShare : startScreenShare}
            aria-label={screenShareEnabled ? "Turn off screen share" : "Turn on screen share"}
            className={`transition-colors ${!screenShareEnabled ? "text-muted-foreground hover:text-foreground" : "text-primary"}`}
          >
            {screenShareEnabled ? (
              <ScreenShare className="h-5 w-5" />
            ) : (
              <ScreenShareOff className="h-5 w-5" />
            )}
          </button>
        </div>
        {joined && (
          <div className="flex items-center gap-3">
            {callDuration && (
              <span className="text-muted-foreground text-responsive-md">{callDuration}</span>
            )}
            <button
              type="button"
              onClick={leave}
              aria-label="Leave voice channel"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
