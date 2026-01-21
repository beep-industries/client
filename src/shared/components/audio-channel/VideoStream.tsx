import { useEffect, useRef } from "react"

interface VideoStreamProps {
  stream: MediaStream
  className?: string
}

export function VideoStream({ stream, className }: VideoStreamProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return <video ref={ref} className={className} autoPlay playsInline muted />
}
