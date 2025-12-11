import { Mic, MicOff, PhoneOff, Volume2, Video, VideoOff } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/Avatar"

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
  onMicClick,
  onCameraClick,
  onHangupClick,
  isMicActive = true,
  isCameraActive = true,
  isInVoiceChannel = true,
}: UserMediaControlsProps) {
  return (
    <div className="border-border flex flex-col rounded-lg border-2">
      {/* Voice channel info - only visible when in a voice channel */}
      {isInVoiceChannel && (
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
        className={`flex items-center p-3 ${isInVoiceChannel ? "justify-between border-t-2" : "justify-start"}`}
      >
        <div className={`flex gap-3`}>
          <button
            onClick={onMicClick}
            className={`transition-colors ${isMicActive ? "text-muted-foreground hover:text-foreground" : "text-red-500"}`}
          >
            {isMicActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            onClick={onCameraClick}
            className={`transition-colors ${isCameraActive ? "text-muted-foreground hover:text-foreground" : "text-red-500"}`}
          >
            {isCameraActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
        </div>
        {isInVoiceChannel && (
          <div className="flex items-center gap-3">
            {callDuration && (
              <span className="text-muted-foreground text-responsive-md">{callDuration}</span>
            )}
            <button
              onClick={onHangupClick}
              className="text-red-500 transition-colors hover:text-red-400"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
