import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/friends/")({
  component: FriendsIndexPage,
})

function FriendsIndexPage() {
  return <div>Hello "/friends/"!</div>
}
