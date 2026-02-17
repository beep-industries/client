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
  Captions,
  CaptionsOff,
  ChevronDown,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/Avatar"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip.tsx"
import { useChannel, useServerById } from "@/shared/queries/community/community.queries.ts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/Dialog"
import { Button } from "@/shared/components/ui/Button"
import { Label } from "@/shared/components/ui/Label"
import { Input } from "@/shared/components/ui/Input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import { useState } from "react"

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
    transcriptionEnabled,
    enableTranscription,
    disableTranscription,
  } = useWebRTC()

  // Form state
  const [transcriptionBackend, setTranscriptionBackend] = useState<string>("openai")
  const [simulStreamingAddr, setSimulStreamingAddr] = useState<string>("")
  const [openaiApiKey, setOpenaiApiKey] = useState<string>("")
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState<string>("")
  const [openaiModel, setOpenaiModel] = useState<string>("")
  const [transcriptionLanguage, setTranscriptionLanguage] = useState<string>("auto")
  const [isDiaOpen, setIsDiaOpen] = useState(false)

  const handleEnableTranscription = async () => {
    try {
      await enableTranscription(transcriptionLanguage, {
        backend: transcriptionBackend,
        simul_streaming_addr: simulStreamingAddr || undefined,
        openai_api_key: openaiApiKey || undefined,
        openai_base_url: openaiBaseUrl || undefined,
        openai_model: openaiModel || undefined,
      })
      setIsDiaOpen(false)
    } catch (e) {
      console.error("Failed to enable transcription", e)
    }
  }

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
          {joined &&
            (transcriptionEnabled ? (
              <button
                type="button"
                onClick={disableTranscription}
                aria-label="Disable transcription"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Captions className="h-5 w-5" />
              </button>
            ) : (
              <Dialog open={isDiaOpen} onOpenChange={setIsDiaOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setIsDiaOpen(true)}
                    aria-label="Enable transcription"
                    className="text-primary transition-colors"
                  >
                    <CaptionsOff className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Enable Transcription</DialogTitle>
                    <DialogDescription>
                      Configure transcription settings for this session.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="backend" className="text-right">
                        Backend
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-[280px] justify-between">
                            {transcriptionBackend === "openai"
                              ? "OpenAI"
                              : transcriptionBackend === "simul_streaming"
                                ? "Simul Streaming"
                                : "Select backend"}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px]">
                          <DropdownMenuItem onSelect={() => setTranscriptionBackend("openai")}>
                            OpenAI
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setTranscriptionBackend("simul_streaming")}
                          >
                            Simul Streaming
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="language" className="text-right">
                        Language
                      </Label>
                      <Input
                        id="language"
                        placeholder="auto"
                        value={transcriptionLanguage}
                        onChange={(e) => setTranscriptionLanguage(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    {transcriptionBackend === "simul_streaming" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="simul-addr" className="text-right">
                          Address
                        </Label>
                        <Input
                          id="simul-addr"
                          placeholder="ws://..."
                          value={simulStreamingAddr}
                          onChange={(e) => setSimulStreamingAddr(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    )}
                    {transcriptionBackend === "openai" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="api-key" className="text-right">
                            API Key
                          </Label>
                          <Input
                            id="api-key"
                            type="password"
                            placeholder="sk-..."
                            value={openaiApiKey}
                            onChange={(e) => setOpenaiApiKey(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="model" className="text-right">
                            Model
                          </Label>
                          <Input
                            id="model"
                            placeholder="whisper-1"
                            value={openaiModel}
                            onChange={(e) => setOpenaiModel(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="base-url" className="text-right">
                            Base URL
                          </Label>
                          <Input
                            id="base-url"
                            placeholder="https://api.openai.com/v1"
                            value={openaiBaseUrl}
                            onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleEnableTranscription}>
                      Enable
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
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
