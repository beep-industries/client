import { createFileRoute } from "@tanstack/react-router"
import AcceptInvitationPage from "@/pages/invitation/AcceptInvitationPage"

function InvitationRoute() {
  const { invitationId } = Route.useParams()
  return <AcceptInvitationPage invitationId={invitationId} />
}

export const Route = createFileRoute("/invitations/$invitationId")({
  component: InvitationRoute,
})
