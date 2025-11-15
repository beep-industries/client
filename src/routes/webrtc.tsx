import { createFileRoute } from "@tanstack/react-router"
import { WebRTCProvider } from "@/app/providers/WebRTCProvider"
import WebRTCDemo from "@/features/webrtc/components/WebRTCDemo"
import { RealTimeSocketProvider } from "@/app/providers/RealTimeSocketProvider.tsx"

export const Route = createFileRoute("/webrtc")({
  component: Page,
})

function Page() {
  return (
    <RealTimeSocketProvider>
      <WebRTCProvider>
        <WebRTCDemo />
      </WebRTCProvider>
    </RealTimeSocketProvider>
  )
}
