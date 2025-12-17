import PageMessages from "@/pages/messages/ui/PageMessages"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/messages/")({
  component: MessagesIndexPage,
})

function MessagesIndexPage() {
  return <PageMessages />
}
