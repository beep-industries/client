import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { Role } from "@/shared/queries/community/community.types"
import { Separator } from "@radix-ui/react-separator"
import { Outlet } from "@tanstack/react-router"
import { RoleButton } from "@/shared/components/RoleButton"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PageRoleSettingPageProps {
  roles?: Role[]
  serverId: string
  origin: "/servers/$id/settings/roles"
  isRoleLoading: boolean
  isRoleError: boolean
  isRoleSuccess: boolean
  onDeleteRole: (roleId: string) => void
  isDeletingRole: boolean
  onCreateRole: () => void
}

export function PageRolesSetting({
  roles,
  origin,
  serverId,
  isRoleError,
  isRoleLoading,
  isRoleSuccess,
  onDeleteRole,
  isDeletingRole,
  onCreateRole,
}: PageRoleSettingPageProps) {
  const { t } = useTranslation()

  if (isRoleError) return <div>Error fetching Roles</div>

  return (
    <div className="flex h-full flex-row gap-2">
      {roles != undefined && isRoleSuccess && (
        <div className="flex flex-col gap-1">
          <Button variant="outline" className="mb-2 flex items-center gap-2" onClick={onCreateRole}>
            <Plus className="h-4 w-4" />
            {t("roles.add_role")}
          </Button>
          {roles.map((role) => (
            <RoleButton
              key={role.id}
              role={role}
              serverId={serverId}
              origin={origin}
              onDelete={onDeleteRole}
              isDeleting={isDeletingRole}
            />
          ))}
        </div>
      )}
      {isRoleLoading && <Skeleton className="size-10" />}
      <Separator orientation="vertical" />
      <Outlet />
    </div>
  )
}
