import type { Role } from "@/shared/queries/community/community.types"
import { Form, FormField, FormControl } from "@/shared/components/ui/Form"
import { Button } from "@/shared/components/ui/Button"
import { PermissionSwitch } from "@/shared/components/PermissionSwitch"
import { PERMISSION_METADATA } from "@/shared/lib/permissions"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

interface PageRolePermissionsSettingsProps {
  role?: Role
  isLoadingRole: boolean
  isErrorRole: boolean
  form: UseFormReturn<{ permissions: Record<string, boolean> }>
  onSubmit: (values: { permissions: Record<string, boolean> }) => void
  isUpdatingRole: boolean
}

export function PageRolePermissionsSettings({
  role,
  isLoadingRole,
  isErrorRole,
  form,
  onSubmit,
  isUpdatingRole,
}: PageRolePermissionsSettingsProps) {
  const { t } = useTranslation()
  const isDirty = form.formState.isDirty

  if (isLoadingRole) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="animate-pulse">
          <div className="bg-muted mb-6 h-8 w-1/4 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-muted h-20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isErrorRole || !role) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-destructive text-lg">{t("rolePermissions.error_loading")}</p>
        <p className="text-muted-foreground">{t("rolePermissions.error_loading_subtitle")}</p>
      </div>
    )
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{role.name}</h1>
        <p className="text-muted-foreground">{t("rolePermissions.subtitle")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {PERMISSION_METADATA.map((permission) => (
              <FormField
                key={permission.key}
                control={form.control}
                name={`permissions.${permission.key}`}
                render={({ field }) => (
                  <FormControl>
                    <PermissionSwitch
                      name={t(permission.nameKey)}
                      description={t(permission.descriptionKey)}
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={isUpdatingRole}
                    />
                  </FormControl>
                )}
              />
            ))}
          </div>

          <div className="bg-background sticky bottom-0 flex flex-row justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isUpdatingRole || !isDirty}
            >
              {t("rolePermissions.reset")}
            </Button>
            <Button type="submit" disabled={isUpdatingRole || !isDirty} isLoading={isUpdatingRole}>
              {t("rolePermissions.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
