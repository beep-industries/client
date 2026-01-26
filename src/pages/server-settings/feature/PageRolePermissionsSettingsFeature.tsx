import { useRoles, useUpdateRole } from "@/shared/queries/community/community.queries"
import { PageRolePermissionsSettings } from "../ui/PageRolePermissionsSettings"
import { useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateRolePermissionsSchema } from "@/shared/zod/update-role-permissions"
import { permissionsToRecord, recordToPermissions } from "@/shared/lib/permissions"
import type z from "zod"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { communityKeys } from "@/shared/queries/community/community.queries"
import { useTranslation } from "react-i18next"

interface PageRolePermissionsSettingsProps {
  serverId: string
  roleId: string
}

export function PageRolePermissionsSettingsFeature({
  roleId,
  serverId,
}: PageRolePermissionsSettingsProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data, isError, isLoading } = useRoles(serverId)

  const role = useMemo(() => {
    return data?.data.find((role) => role.id === roleId)
  }, [data, roleId])

  const {
    mutateAsync: updateRole,
    isPending: isUpdatingRole,
    isSuccess: isUpdateRoleSuccess,
    isError: isUpdateRoleError,
    reset: resetUpdateRole,
  } = useUpdateRole()

  const form = useForm<z.infer<typeof updateRolePermissionsSchema>>({
    resolver: zodResolver(updateRolePermissionsSchema),
    defaultValues: {
      permissions: {},
    },
  })

  useEffect(() => {
    if (role) {
      form.reset({
        permissions: permissionsToRecord(role.permissions),
      })
    }
  }, [role, form])

  useEffect(() => {
    if (isUpdateRoleSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.roles(serverId) })
      queryClient.invalidateQueries({ queryKey: communityKeys.role(roleId) })
      toast.success(t("rolePermissions.success_updating"))
      resetUpdateRole()
    } else if (isUpdateRoleError) {
      toast.error(t("rolePermissions.error_updating"))
      resetUpdateRole()
    }
  }, [isUpdateRoleSuccess, isUpdateRoleError, queryClient, serverId, roleId, resetUpdateRole, t])

  const onSubmit = async (values: z.infer<typeof updateRolePermissionsSchema>) => {
    const permissionMask = recordToPermissions(values.permissions)
    await updateRole({
      roleId,
      body: {
        permissions: permissionMask,
      },
    })
  }

  return (
    <PageRolePermissionsSettings
      role={role}
      isLoadingRole={isLoading}
      isErrorRole={isError}
      form={form}
      onSubmit={onSubmit}
      isUpdatingRole={isUpdatingRole}
    />
  )
}
