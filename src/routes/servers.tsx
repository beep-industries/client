import { useServers } from "@/shared/queries/community/community.queries"
import type { GetServersResponse, Server } from "@/shared/queries/community/community.types"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/servers")({
  component: RouteComponent,
})

function RouteComponent() {
  const [paginationPage] = useState<{ page: number; limit: number }>({ page: 1, limit: 20 })
  const { data, isLoading: serversLoading } = useServers(paginationPage.page, paginationPage.limit)

  const [servers, setServers] = useState<Server[]>([])

  useEffect(() => {
    if (data) {
      setServers((data as GetServersResponse).data as Server[])
    }
  }, [data])

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Liste des serveurs</h1>
      {serversLoading ? (
        <p>Chargement des serveurs...</p>
      ) : (
        <ul>
          {servers.map((server) => (
            <li key={server.id} className="mb-4 rounded border p-4">
              <h2 className="text-xl font-semibold">{server.name}</h2>
              <p>{server.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
