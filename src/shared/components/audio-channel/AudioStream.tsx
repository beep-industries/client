import { useEffect, useRef } from "react"

interface AudioStreamProps {
  stream: MediaStream
  muted?: boolean
}

export function AudioStream({ stream, muted = false }: AudioStreamProps) {
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
