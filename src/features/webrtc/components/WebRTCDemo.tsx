import { useEffect, useMemo, useRef, useState } from "react"
import { useWebRTC } from "@/app/providers/WebRTCProvider"
import { useCurrentUser, useUsersBySubs } from "@/shared/queries/user/user.queries.ts"
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
  Grid2X2,
  LayoutGrid,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  MoreVertical,
  Pin,
  PinOff,
  Presentation,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
  Users,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { cn } from "@/shared/lib/utils"

type LayoutType = "grid" | "spotlight" | "sidebar"

interface ParticipantStream {
  userId: string
  user: {
    display_name: string
    sub: string
    profile_picture: string
    description: string
  }
  tracks: { audio: MediaStream | null; video: MediaStream | null }
  video: boolean
  audio: boolean
}

export default function WebRTCDemo() {
  const { data: currentUser } = useCurrentUser()
  const { iceStatus, channelStatus, remoteTracks, videoStreamRef } = useWebRTC()
  const usersIn = useUsersBySubs(remoteTracks.map((track) => track.userId))
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [pinnedUser, setPinnedUser] = useState<string | null>(null)
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set())
  const [fullscreenUser, setFullscreenUser] = useState<string | null>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  // Map remote tracks to MediaStreams
  const streams: ParticipantStream[] = useMemo(() => {
    return remoteTracks.map((track) => {
      return {
        userId: track.userId,
        user: usersIn.find((user) => user?.data?.sub === track.userId)?.data || {
          display_name: "Unknown",
          sub: track.userId,
          profile_picture: "",
          description: "",
        },
        tracks: {
          audio: track.tracks.audio,
          video:
            track.userId === currentUser?.sub
              ? videoStreamRef?.current || null
              : track.tracks.video,
        },
        video: track.video,
        audio: track.audio,
      }
    })
  }, [videoStreamRef, currentUser?.sub, remoteTracks, usersIn])

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

  const handlePinUser = (userId: string) => {
    setPinnedUser((prev) => (prev === userId ? null : userId))
  }

  const handleMuteUser = (userId: string) => {
    setMutedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const handleFullscreen = (userId: string) => {
    setFullscreenUser(userId)
  }

  const handleExitFullscreen = () => {
    setFullscreenUser(null)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreenUser) {
        handleExitFullscreen()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [fullscreenUser])

  // Reorder streams so pinned user is first
  const orderedStreams = useMemo(() => {
    if (!pinnedUser) return streams
    const pinned = streams.find((s) => s.userId === pinnedUser)
    const others = streams.filter((s) => s.userId !== pinnedUser)
    return pinned ? [pinned, ...others] : streams
  }, [streams, pinnedUser])

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Top Bar */}
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
              {streams.length} participant{streams.length !== 1 ? "s" : ""}
            </span>
          </div>
          {channelStatus && (
            <>
              <div className="bg-border h-4 w-px" />
              <span className="text-muted-foreground text-xs">{channelStatus}</span>
            </>
          )}
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {layout === "grid" && <Grid2X2 className="size-4" />}
                {layout === "spotlight" && <Presentation className="size-4" />}
                {layout === "sidebar" && <LayoutGrid className="size-4" />}
                <span className="capitalize">{layout}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLayout("grid")} className="gap-2">
                <Grid2X2 className="size-4" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLayout("spotlight")} className="gap-2">
                <Presentation className="size-4" />
                Spotlight
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLayout("sidebar")} className="gap-2">
                <LayoutGrid className="size-4" />
                Sidebar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-auto p-4">
        {streams.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-4">
            <Users className="size-16 opacity-50" />
            <p className="text-lg">Waiting for participants to join...</p>
          </div>
        ) : (
          <div
            className={cn(
              "h-full gap-3",
              layout === "grid" && "grid auto-rows-fr",
              layout === "grid" && streams.length === 1 && "grid-cols-1",
              layout === "grid" && streams.length === 2 && "grid-cols-2",
              layout === "grid" && streams.length >= 3 && streams.length <= 4 && "grid-cols-2",
              layout === "grid" && streams.length >= 5 && streams.length <= 6 && "grid-cols-3",
              layout === "grid" && streams.length >= 7 && "grid-cols-4",
              layout === "spotlight" && "flex flex-col",
              layout === "sidebar" && "flex gap-3"
            )}
          >
            {layout === "spotlight" && orderedStreams.length > 0 && (
              <>
                {/* Main spotlight video */}
                <div className="min-h-0 flex-1">
                  <ParticipantCard
                    participant={orderedStreams[0]}
                    isSpotlight
                    isPinned={pinnedUser === orderedStreams[0].userId}
                    isMuted={mutedUsers.has(orderedStreams[0].userId)}
                    isCurrentUser={orderedStreams[0].userId === currentUser?.sub}
                    onPin={() => handlePinUser(orderedStreams[0].userId)}
                    onMute={() => handleMuteUser(orderedStreams[0].userId)}
                    onFullscreen={() => handleFullscreen(orderedStreams[0].userId)}
                  />
                </div>
                {/* Thumbnail strip */}
                {orderedStreams.length > 1 && (
                  <div className="flex h-32 gap-2 overflow-x-auto py-2">
                    {orderedStreams.slice(1).map((participant) => (
                      <div key={participant.userId} className="w-48 shrink-0">
                        <ParticipantCard
                          participant={participant}
                          isThumbnail
                          isPinned={pinnedUser === participant.userId}
                          isMuted={mutedUsers.has(participant.userId)}
                          isCurrentUser={participant.userId === currentUser?.sub}
                          onPin={() => handlePinUser(participant.userId)}
                          onMute={() => handleMuteUser(participant.userId)}
                          onFullscreen={() => handleFullscreen(participant.userId)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {layout === "sidebar" && orderedStreams.length > 0 && (
              <>
                {/* Main video */}
                <div className="min-h-0 flex-1">
                  <ParticipantCard
                    participant={orderedStreams[0]}
                    isSpotlight
                    isPinned={pinnedUser === orderedStreams[0].userId}
                    isMuted={mutedUsers.has(orderedStreams[0].userId)}
                    isCurrentUser={orderedStreams[0].userId === currentUser?.sub}
                    onPin={() => handlePinUser(orderedStreams[0].userId)}
                    onMute={() => handleMuteUser(orderedStreams[0].userId)}
                    onFullscreen={() => handleFullscreen(orderedStreams[0].userId)}
                  />
                </div>
                {/* Sidebar */}
                {orderedStreams.length > 1 && (
                  <div className="flex w-64 flex-col gap-2 overflow-y-auto">
                    {orderedStreams.slice(1).map((participant) => (
                      <div key={participant.userId} className="h-36 shrink-0">
                        <ParticipantCard
                          participant={participant}
                          isThumbnail
                          isPinned={pinnedUser === participant.userId}
                          isMuted={mutedUsers.has(participant.userId)}
                          isCurrentUser={participant.userId === currentUser?.sub}
                          onPin={() => handlePinUser(participant.userId)}
                          onMute={() => handleMuteUser(participant.userId)}
                          onFullscreen={() => handleFullscreen(participant.userId)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {layout === "grid" &&
              orderedStreams.map((participant) => (
                <ParticipantCard
                  key={participant.userId}
                  participant={participant}
                  isPinned={pinnedUser === participant.userId}
                  isMuted={mutedUsers.has(participant.userId)}
                  isCurrentUser={participant.userId === currentUser?.sub}
                  onPin={() => handlePinUser(participant.userId)}
                  onMute={() => handleMuteUser(participant.userId)}
                  onFullscreen={() => handleFullscreen(participant.userId)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {fullscreenUser && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {(() => {
            const participant = streams.find((s) => s.userId === fullscreenUser)
            if (!participant) return null
            const isFullscreenCurrentUser = participant.userId === currentUser?.sub
            return (
              <>
                {/* Fullscreen Video */}
                <div className="relative h-full w-full">
                  {participant.video && participant.tracks.video ? (
                    <VideoStream
                      stream={participant.tracks.video}
                      className="h-full w-full object-contain"
                    />
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
                        {isFullscreenCurrentUser && " (You)"}
                      </span>
                      <span className="text-muted-foreground">Camera off</span>
                    </div>
                  )}

                  {/* Audio for fullscreen - skip for current user */}
                  {!isFullscreenCurrentUser && participant.audio && participant.tracks.audio && (
                    <AudioStream
                      stream={participant.tracks.audio}
                      muted={mutedUsers.has(participant.userId)}
                    />
                  )}

                  {/* Fullscreen Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {/* Mute button - only for other users */}
                    {!isFullscreenCurrentUser && participant.audio && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "bg-black/50 text-white hover:bg-black/70",
                              mutedUsers.has(participant.userId) &&
                                "bg-red-500/70 hover:bg-red-500/90"
                            )}
                            onClick={() => handleMuteUser(participant.userId)}
                          >
                            {mutedUsers.has(participant.userId) ? (
                              <VolumeX className="size-5" />
                            ) : (
                              <Volume2 className="size-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {mutedUsers.has(participant.userId) ? "Unmute" : "Mute"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-black/50 text-white hover:bg-black/70"
                          onClick={handleExitFullscreen}
                        >
                          <Minimize2 className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Exit fullscreen (Esc)</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-black/50 text-white hover:bg-black/70"
                          onClick={handleExitFullscreen}
                        >
                          <X className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
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
                        {isFullscreenCurrentUser && " (You)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Audio status - for current user show mic state, for others show mute state */}
                      {isFullscreenCurrentUser ? (
                        participant.audio ? (
                          <Mic className="size-5 text-white" />
                        ) : (
                          <MicOff className="size-5 text-red-400" />
                        )
                      ) : mutedUsers.has(participant.userId) ? (
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
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

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

function ParticipantCard({
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
            {!isThumbnail && <span className="text-muted-foreground text-sm">Camera off</span>}
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
          <span className="text-xs text-white">Muted</span>
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
            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
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
          <TooltipContent>{isPinned ? "Unpin" : "Pin"}</TooltipContent>
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
            <TooltipContent>Fullscreen</TooltipContent>
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
              {isPinned ? "Unpin" : "Pin to spotlight"}
            </DropdownMenuItem>
            {showAudioControls && onMute && (
              <DropdownMenuItem onClick={onMute}>
                {isMuted ? (
                  <Volume2 className="mr-2 size-4" />
                ) : (
                  <VolumeX className="mr-2 size-4" />
                )}
                {isMuted ? "Unmute" : "Mute"}
              </DropdownMenuItem>
            )}
            {onFullscreen && (
              <DropdownMenuItem onClick={onFullscreen}>
                <Maximize2 className="mr-2 size-4" />
                Fullscreen
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
            {isCurrentUser && " (You)"}
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

function VideoStream({ stream, className }: { stream: MediaStream; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return <video ref={ref} className={className} autoPlay playsInline muted />
}

function AudioStream({ stream, muted = false }: { stream: MediaStream; muted?: boolean }) {
  const ref = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (ref.current) {
      ref.current.muted = muted
    }
  }, [muted])

  return <audio ref={ref} autoPlay muted={muted} />
}
