import { PageRolesSetting } from "../ui/PageRolesSetting"
import { useRoles, useDeleteRole } from "@/shared/queries/community/community.queries"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { communityKeys } from "@/shared/queries/community/community.queries"

interface PageRolesSettingFeatureProps {
  serverId: string
}

export function PageRolesSettingFeature({ serverId }: PageRolesSettingFeatureProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, isSuccess } = useRoles(serverId)

  const {
    mutate: deleteRole,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteRole()

  useEffect(() => {
    if (isDeleteSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.roles(serverId) })
      toast.success(t("roles.delete.success"))
    } else if (isDeleteError) {
      toast.error(t("roles.delete.error"))
    }
  }, [isDeleteSuccess, isDeleteError, queryClient, serverId, t])

  const handleDeleteRole = (roleId: string) => {
    deleteRole(roleId)
  }

  const handleCreateRole = () => {
    navigate({
      to: "/servers/$id/settings/roles/new",
      params: { id: serverId },
    })
  }

  return (
    <PageRolesSetting
      roles={data?.data}
      serverId={serverId}
      origin={"/servers/$id/settings/roles"}
      isRoleLoading={isLoading}
      isRoleError={isError}
      isRoleSuccess={isSuccess}
      onDeleteRole={handleDeleteRole}
      isDeletingRole={isDeleting}
      onCreateRole={handleCreateRole}
    />
  )
}
