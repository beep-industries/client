import { useEffect, useMemo, useRef, useState } from "react"
import { useWebRTC } from "@/app/providers/WebRTCProvider"
import { Button } from "@/shared/components/ui/Button.tsx"
import { Input } from "@/shared/components/ui/Input.tsx"

export default function WebRTCDemo() {
  const {
    endpointId,
    iceStatus,
    channelStatus,
    joined,
    camEnabled,
    micEnabled,
    remoteTracks,
    join,
    leave,
    startCam,
    startMic,
  } = useWebRTC()

  const [session, setSession] = useState<number>(10000000)

  // Map remote tracks to MediaStreams
  const streams = useMemo(() => {
    return remoteTracks.map((track) => {
      const stream = new MediaStream()
      stream.addTrack(track)
      return { id: track.id, stream }
    })
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
        <Button onClick={() => join(session)} disabled={joined}>
          Join
        </Button>
        <Button onClick={() => leave()} disabled={!joined}>
          Leave
        </Button>
        <Button onClick={() => startCam()} disabled={!joined || !camEnabled}>
          Cam
        </Button>
        <Button onClick={() => startMic()} disabled={!joined || !micEnabled}>
          Mic
        </Button>
        <span>
          Status: <strong>{iceStatus}</strong>
        </span>
      </div>
      <div style={{ marginTop: 8 }}>{channelStatus}</div>

      <div id="media" style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        {streams.map(({ id, stream }) => (
          <Video key={id} stream={stream} />
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>Endpoint: {endpointId}</div>
    </div>
  )
}

function Video({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }
  }, [stream])
  return <video ref={ref} width={500} controls autoPlay />
}
