import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { cn } from "@/shared/lib/utils"
import type { Role } from "@/shared/queries/community/community.types"
import { Separator } from "@radix-ui/react-separator"
import { Link, Outlet } from "@tanstack/react-router"

interface PageRoleSettingPageProps {
  roles?: Role[]
  serverId: string
  origin: "/servers/$id/settings/roles"
  isRoleLoading: boolean
  isRoleError: boolean
  isRoleSuccess: boolean
}

export function PageRolesSetting({
  roles,
  origin,
  serverId,
  isRoleError,
  isRoleLoading,
  isRoleSuccess,
}: PageRoleSettingPageProps) {
  const roleButton = RoleNavigatorButton(serverId, origin)

  if (isRoleError) return <div>Error fetching Roles</div>

  return (
    <div className="flex h-full flex-row gap-2">
      {roles != undefined && isRoleSuccess && (
        <div className="flex flex-col">{roles.map(roleButton)}</div>
      )}
      {isRoleLoading && <Skeleton className="size-10" />}
      <Separator orientation="vertical" />
      <Outlet />
    </div>
  )
}

function RoleNavigatorButton(serverId: string, origin: "/servers/$id/settings/roles") {
  return (role: Role) => {
    return (
      <Button
        variant={"ghost"}
        className={cn(
          "text-responsive-lg! truncate text-left"
          // selectedSettingPage === SettingPages.Roles && "bg-accent"
        )}
        asChild
      >
        <Link from={origin} to="./$roleId" params={{ id: serverId, roleId: role.id }}>
          {role.name}
        </Link>
      </Button>
    )
  }
}
