import { useEffect, useMemo, useRef } from "react"
import { useWebRTC } from "@/app/providers/WebRTCProvider"
import { useUsersBySubs } from "@/shared/queries/user/user.queries.ts"

export default function WebRTCDemo() {
  const { iceStatus, channelStatus, remoteTracks } = useWebRTC()
  const usersIn = useUsersBySubs(remoteTracks.map((track) => track.userId))

  // Map remote tracks to MediaStreams
  const streams = useMemo(() => {
    const tracks = remoteTracks.map((track) => {
      return {
        userId: track.userId,
        user: usersIn.find((user) => user?.data?.sub === track.userId)?.data || {
          display_name: "unknown",
          sub: track.userId,
          profile_picture: "",
          description: "",
        },
        tracks: { audio: track.tracks.audio, video: track.tracks.video },
        video: track.video,
        audio: track.audio,
      }
    })
    console.log("streams", remoteTracks)
    return tracks
  }, [remoteTracks, usersIn])

  return (
    <div>
      <div>
        <span>
          Status: <strong>{iceStatus}</strong>
        </span>
      </div>
      <div style={{ marginTop: 8 }}>{channelStatus}</div>
      <div id="media" style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        {streams.map((user) => (
          <div key={user.userId}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{user.user.display_name}</span>
            {user.video ? <Video stream={user.tracks.video} /> : <span>No video</span>}
            {user.audio ? <Video stream={user.tracks.audio} /> : <span>No audio</span>}
          </div>
        ))}
      </div>
      '{" "}
    </div>
  )
}

function Video({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }
  }, [stream])
  return <video ref={ref} width={500} controls autoPlay />
}
