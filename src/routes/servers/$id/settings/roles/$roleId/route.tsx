import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/servers/$id/settings/roles/$roleId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id, roleId } = Route.useParams()
  const path = "/servers/$id/settings/roles/$roleId"
  return (
    <div className="flex w-full flex-col">
      <Tabs defaultValue="permissions">
        <TabsList variant="line" className="w-full">
          <Link from={path} to={"permissions"} params={{ id, roleId }} className="w-1/2">
            <TabsTrigger value="permissions" className="w-full">
              Permissions
            </TabsTrigger>
          </Link>
          <Link from={path} to={"members"} params={{ id, roleId }} className="w-1/2">
            <TabsTrigger value="members" className="w-full">
              Members
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  )
}
