import { useEffect, useMemo, useRef, useState } from "react"
import { useWebRTC } from "@/app/providers/WebRTCProvider"
import { Button } from "@/shared/components/ui/Button.tsx"
import { Input } from "@/shared/components/ui/Input.tsx"

export default function WebRTCDemo() {
  const {
    iceStatus,
    channelStatus,
    joined,
    camEnabled,
    micEnabled,
    remoteTracks,
    join,
    leave,
    startCam,
    stopCam,
    startMic,
    stopMic,
  } = useWebRTC()

  const [session, setSession] = useState<number>(10000000)
  const [username, setUsername] = useState<string>("")

  // Map remote tracks to MediaStreams
  const streams = useMemo(() => {
    const tracks = remoteTracks.map((track) => {
      return {
        userId: track.userId,
        username: track.userId,
        tracks: { audio: track.tracks.audio, video: track.tracks.video },
        video: track.video,
        audio: track.audio,
      }
    })
    console.log("streams", remoteTracks)
    return tracks
  }, [remoteTracks])

  return (
    <div>
      <div>
        <label htmlFor="session">Session:</label>
        <Input
          id="session"
          type="number"
          value={session}
          onChange={(e) => setSession(Number(e.target.value))}
          disabled={joined}
          style={{ color: "black", padding: 4 }}
        />
        <Input
          id="username"
          type="string"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={joined}
          style={{ color: "black", padding: 4 }}
        />
        <Button onClick={() => join(session)} disabled={joined}>
          Join
        </Button>
        <Button onClick={() => leave()} disabled={!joined}>
          Leave
        </Button>
        <Button onClick={camEnabled ? () => startCam() : () => stopCam()} disabled={!joined}>
          {camEnabled ? "Cam" : "Mute Cam"}
        </Button>
        <Button onClick={micEnabled ? () => startMic() : () => stopMic()} disabled={!joined}>
          {micEnabled ? "Mic" : "Mute Mic"}
        </Button>
        <span>
          Status: <strong>{iceStatus}</strong>
        </span>
      </div>
      <div style={{ marginTop: 8 }}>{channelStatus}</div>
      <div id="media" style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        {streams.map((user) => (
          <div key={user.userId}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{user.username}</span>
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
