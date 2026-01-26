import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/servers/$id/settings/roles/$roleId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { id, roleId } = Route.useParams()
  const path = "/servers/$id/settings/roles/$roleId"
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="bg-background shrink-0">
        <Tabs defaultValue="permissions">
          <TabsList variant="line" className="w-full">
            <Link from={path} to={"permissions"} params={{ id, roleId }} className="w-1/2">
              <TabsTrigger value="permissions" className="w-full">
                {t("roleTabs.permissions")}
              </TabsTrigger>
            </Link>
            <Link from={path} to={"members"} params={{ id, roleId }} className="w-1/2">
              <TabsTrigger value="members" className="w-full">
                {t("roleTabs.members")}
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
