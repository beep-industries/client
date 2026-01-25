import { PageRolesSetting } from "../ui/PageRolesSetting"
import { useRoles } from "@/shared/queries/community/community.queries"

interface PageRolesSettingFeatureProps {
  serverId: string
}

export function PageRolesSettingFeature({ serverId }: PageRolesSettingFeatureProps) {
  const { data, isLoading, isError, isSuccess } = useRoles(serverId)
  return (
    <PageRolesSetting
      roles={data?.data}
      serverId={serverId}
      origin={"/servers/$id/settings/roles"}
      isRoleLoading={isLoading}
      isRoleError={isError}
      isRoleSuccess={isSuccess}
    />
  )
}
