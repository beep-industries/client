import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addRoleFormSchema } from "@/shared/zod/add-role"
import type z from "zod"
import { AddRoleForm } from "@/shared/forms/AddRole"
import { useCreateRole } from "@/shared/queries/community/community.queries"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { communityKeys } from "@/shared/queries/community/community.queries"
import { PERMISSION_METADATA } from "@/shared/lib/permissions"

interface PageCreateRoleFeatureProps {
  serverId: string
}

export function PageCreateRoleFeature({ serverId }: PageCreateRoleFeatureProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Initialize all permissions to false
  const initialPermissions = PERMISSION_METADATA.reduce(
    (acc, permission) => {
      acc[permission.key] = false
      return acc
    },
    {} as Record<string, boolean>
  )

  const form = useForm<z.infer<typeof addRoleFormSchema>>({
    resolver: zodResolver(addRoleFormSchema),
    defaultValues: {
      name: "",
      permissions: initialPermissions,
    },
  })

  const { mutate: createRole, isPending, isSuccess, isError } = useCreateRole(serverId)

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.roles(serverId) })
      toast.success(t("roles.create.success"))
      navigate({
        to: "/servers/$id/settings/roles",
        params: { id: serverId },
      })
    } else if (isError) {
      toast.error(t("roles.create.error"))
    }
  }, [isSuccess, isError, navigate, serverId, t, queryClient])

  const onSubmit = (values: z.infer<typeof addRoleFormSchema>) => {
    // Convert permissions object to bitfield
    let permissionsBitfield = 0
    for (const [key, value] of Object.entries(values.permissions)) {
      if (value) {
        const permissionMeta = PERMISSION_METADATA.find((p) => p.key === key)
        if (permissionMeta) {
          permissionsBitfield |= permissionMeta.value
        }
      }
    }

    createRole({
      name: values.name,
      permissions: permissionsBitfield,
    })
  }

  const handleCancel = () => {
    navigate({
      to: "/servers/$id/settings/roles",
      params: { id: serverId },
    })
  }

  return <AddRoleForm form={form} loading={isPending} onSubmit={onSubmit} onCancel={handleCancel} />
}
