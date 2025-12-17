import SendingBar from "@/shared/components/SendingBar"
import TopBar from "@/shared/components/TopBar"

export default function PageMessages() {
  return (
    <div className="flex h-screen flex-col justify-between">
      <TopBar />
      <div id="messages-section" className="h-full overflow-scroll"></div>
      <div className="flex justify-center p-4">
        <SendingBar />
      </div>
    </div>
  )
}
