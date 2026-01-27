import type { Channel as ChannelType } from "@/shared/queries/community/community.types.ts"
import { RealTimeTopicProvider } from "@/app/providers/RealTimeTopicProvider.tsx"
import { useWebRTC } from "@/app/providers/WebRTCProvider.tsx"
import { Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react"
import Channel from "@/shared/components/Channel.tsx"
import { useMemo } from "react"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar.tsx"
import { useServerMembers } from "@/shared/queries/community/community.queries.ts"
import { useUsersBatch } from "@/shared/queries/user/user.queries.ts"

interface VoiceChannelProps {
  channel: ChannelType
  isChildren?: boolean
}

export default function VoiceChannel({ channel, isChildren }: VoiceChannelProps) {
  const { session, joined } = useWebRTC()
  const { presences } = useRealTimeSocket()

  const { data: membersData } = useServerMembers(channel.server_id)

  const { remoteTracks } = useWebRTC()

  const topic = useMemo(
    () => [{ topic: `voice-channel:${channel.id}`, params: { presence_only: true } }],
    [channel.id]
  )

  // Get all unique user IDs from all pages
  const userIds = useMemo(() => {
    return membersData?.pages.flatMap((page) => page.data.map((member) => member.user_id)) ?? []
  }, [membersData])

  // Fetch user details in batch
  const { data: usersData } = useUsersBatch(userIds)

  const channelPresences = useMemo(() => {
    const list = presences[`voice-channel:${channel.id}`] ?? []

    const map = new Map<string, { audio?: boolean; video?: boolean }>()

    for (const presence of list) {
      const meta = presence.metas?.[0]
      if (!meta?.user_id) continue

      map.set(meta.user_id as string, {
        audio: meta.audio as boolean,
        video: meta.video as boolean,
      })
    }

    return map
  }, [presences, channel.id])

  const usersById = useMemo(() => {
    if (!usersData) return new Map()
    return new Map(usersData.map((user) => [user.sub, user]))
  }, [usersData])

  const membersIn = useMemo(() => {
    if (!membersData?.pages) return []
    return membersData.pages.flatMap((page) =>
      page.data.flatMap((member) => {
        if (!remoteTracks) return []
        const presence = remoteTracks.find((track) => track.userId === member.user_id)
        if (!presence) return [] // not connected to voice
        const user = usersById.get(member.user_id)

        return [
          {
            id: member.user_id,
            username: member.nickname ?? user?.display_name ?? member.user_id,
            avatar_url: user?.profile_picture,
            description: user?.description,
            audio: presence.audio,
            video: presence.video,
          },
        ]
      })
    )
  }, [membersData, remoteTracks, usersById])

  const membersOut = useMemo(() => {
    if (!membersData?.pages) return []

    return membersData.pages.flatMap((page) =>
      page.data.flatMap((member) => {
        const presence = channelPresences.get(member.user_id)
        if (!presence) return [] // not connected to voice

        const user = usersById.get(member.user_id)

        return [
          {
            id: member.user_id,
            username: member.nickname ?? user?.display_name ?? member.user_id,
            avatar_url: user?.profile_picture,
            description: user?.description,
            audio: presence.audio,
            video: presence.video,
          },
        ]
      })
    )
  }, [membersData, usersById, channelPresences])

  return joined && session === channel.id ? (
    <>
      <Channel icon={Volume2} channel={channel} isChildren={isChildren} />
      {membersIn?.length > 0 && (
        <div className="ml-6 space-y-1">
          {membersIn.map((member) => {
            return (
              <div
                key={member.id}
                className="bg-muted/50 hover:bg-muted flex items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="relative">
                    <Avatar className="size-6 rounded-md">
                      <AvatarImage src={member.avatar_url} alt={member.username} />
                      <AvatarFallback className="text-xs">
                        {member.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="truncate text-sm font-medium">{member.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  {member.video ? (
                    <Video className="h-4 w-4 text-green-500" />
                  ) : (
                    <VideoOff className="text-muted-foreground h-4 w-4" />
                  )}
                  {member.audio ? (
                    <Mic className="h-4 w-4 text-green-500" />
                  ) : (
                    <MicOff className="text-muted-foreground h-4 w-4" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  ) : (
    <RealTimeTopicProvider topics={topic}>
      <Channel icon={Volume2} channel={channel} isChildren={isChildren} />
      {membersOut?.length > 0 && (
        <div className="ml-6 space-y-1">
          {membersOut.map((member) => {
            return (
              <div
                key={member.id}
                className="bg-muted/50 hover:bg-muted flex items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="relative">
                    <Avatar className="size-6 rounded-md">
                      <AvatarImage src={member.avatar_url} alt={member.username} />
                      <AvatarFallback className="text-xs">
                        {member.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="truncate text-sm font-medium">{member.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  {member.video ? (
                    <Video className="h-4 w-4 text-green-500" />
                  ) : (
                    <VideoOff className="text-muted-foreground h-4 w-4" />
                  )}
                  {member.audio ? (
                    <Mic className="h-4 w-4 text-green-500" />
                  ) : (
                    <MicOff className="text-muted-foreground h-4 w-4" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </RealTimeTopicProvider>
  )
}
