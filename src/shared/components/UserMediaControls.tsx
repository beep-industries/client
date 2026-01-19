import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/Avatar"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { useEffect } from "react"

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

export function UserMediaControls({
  serverProfileUrl,
  channelName,
  callDuration,
}: UserMediaControlsProps) {
  const {
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
  } = useWebRTC()

  useEffect(() => {
    console.log("useWebRTC properties: ", camEnabled, micEnabled, joined)
  })

  return (
    <div className="border-border flex flex-col rounded-lg border">
      {/* Voice channel info - only visible when in a voice channel */}
      {joined && (
        <div className="bg-secondary flex items-center gap-2 rounded-t-md p-3">
          <Avatar className="h-5 w-5">
            <AvatarImage src={serverProfileUrl} alt={channelName} />
            <AvatarFallback className="bg-background text-foreground rounded-sm">
              {channelName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Volume2 className="text-muted-foreground h-4 w-4" />
          <span className="text-foreground text-responsive-md truncate font-bold">
            {channelName}
          </span>
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
            className={`transition-colors ${micEnabled ? "text-muted-foreground hover:text-foreground" : "text-red-500"}`}
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={camEnabled ? stopCam : startCam}
            aria-label={camEnabled ? "Turn off camera" : "Turn on camera"}
            className={`transition-colors ${camEnabled ? "text-muted-foreground hover:text-foreground" : "text-red-500"}`}
          >
            {camEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={screenShareEnabled ? stopScreenShare : startScreenShare}
            aria-label={screenShareEnabled ? "Turn off screen share" : "Turn on screen share"}
            className={`transition-colors ${screenShareEnabled ? "text-muted-foreground hover:text-foreground" : "text-red-500"}`}
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
