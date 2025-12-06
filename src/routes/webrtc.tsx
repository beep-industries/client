import { createFileRoute } from "@tanstack/react-router"
import { WebRTCProvider } from "@/app/providers/WebRTCProvider"
import WebRTCDemo from "@/features/webrtc/components/WebRTCDemo"

export const Route = createFileRoute("/webrtc")({
  component: Page,
})

function Page() {
  return (
    <WebRTCProvider>
      <WebRTCDemo />
    </WebRTCProvider>
  )
}
