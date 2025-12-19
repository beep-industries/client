import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/messages/$id")({
  component: MessagePage,
})

function MessagePage() {
  const { id } = Route.useParams()

  return <div>Message {id}</div>
}
