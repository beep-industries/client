import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useWebRTC } from "@/app/providers/WebRTCProvider"
import { useCurrentUser, useUsersBySubs } from "@/shared/queries/user/user.queries.ts"
import { Users } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { VideoConferenceTopBar } from "@/shared/components/audio-channel/VideoConferenceTopBar.tsx"
import { ParticipantCard } from "@/shared/components/audio-channel/ParticipantCard.tsx"
import type { LayoutType, ParticipantStream } from "@/pages/channel/types.ts"
import { FullscreenOverlay } from "@/shared/components/audio-channel/FullscreenOverlay.tsx"

export default function PageAudioChannel() {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { iceStatus, channelStatus, remoteTracks, videoStreamRef } = useWebRTC()
  const usersIn = useUsersBySubs(remoteTracks.map((track) => track.userId))
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [pinnedUser, setPinnedUser] = useState<string | null>(null)
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set())
  const [fullscreenUser, setFullscreenUser] = useState<string | null>(null)

  // Map remote tracks to MediaStreams
  const streams: ParticipantStream[] = useMemo(() => {
    return remoteTracks.map((track) => {
      return {
        voiceId: track.id,
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

  // Get fullscreen participant
  const fullscreenParticipant = fullscreenUser
    ? streams.find((s) => s.userId === fullscreenUser)
    : null

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Top Bar */}
      <VideoConferenceTopBar
        iceStatus={iceStatus}
        channelStatus={channelStatus}
        participantCount={streams.length}
        layout={layout}
        onLayoutChange={setLayout}
      />

      {/* Video Grid */}
      <div className="flex-1 overflow-auto p-4">
        {streams.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-4">
            <Users className="size-16 opacity-50" />
            <p className="text-lg">{t("videoConference.waiting_for_participants")}</p>
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
      {fullscreenParticipant && (
        <FullscreenOverlay
          participant={fullscreenParticipant}
          isCurrentUser={fullscreenParticipant.userId === currentUser?.sub}
          isMuted={mutedUsers.has(fullscreenParticipant.userId)}
          onMute={() => handleMuteUser(fullscreenParticipant.userId)}
          onClose={handleExitFullscreen}
        />
      )}
    </div>
  )
}
