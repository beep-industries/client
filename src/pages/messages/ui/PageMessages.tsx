import SendingBar from "@/shared/components/SendingBar"

export default function PageMessages() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div id="messages-section" className="h-full overflow-scroll"></div>
      <div className="flex justify-center p-4">
        <SendingBar />
      </div>
    </div>
  )
}
