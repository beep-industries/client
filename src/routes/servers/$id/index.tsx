import { createFileRoute } from "@tanstack/react-router"
import PageServer from "@/pages/server/ui/PageServer"

export const Route = createFileRoute("/servers/$id/")({
  component: ServerIndexPage,
})

function ServerIndexPage() {
  const { id } = Route.useParams()
  return <PageServer id={id} /> //TODO: redirect to the first text channel
}
