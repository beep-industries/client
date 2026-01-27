import PageServer from "@/pages/server/ui/PageServer"
import { useChannels } from "@/shared/queries/community/community.queries"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/servers/$id/")({
  component: ServerIndexPage,
})

function ServerIndexPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: channels, isSuccess } = useChannels(id)

  useEffect(() => {
    if (isSuccess && channels && channels.length > 0) {
      const firstChannel = channels[0]
      navigate({
        to: "/servers/$id/$channelId",
        params: { id, channelId: firstChannel.id },
        replace: true,
      })
    }
  }, [isSuccess, channels, navigate, id])

  return <PageServer id={id} />
}
