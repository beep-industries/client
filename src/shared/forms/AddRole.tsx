import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { addRoleFormSchema } from "../zod/add-role"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { PermissionSwitch } from "../components/PermissionSwitch"
import { PERMISSION_METADATA } from "../lib/permissions"
import { useTranslation } from "react-i18next"

interface AddRoleFormProps {
  form: UseFormReturn<z.infer<typeof addRoleFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof addRoleFormSchema>) => void
  onCancel?: () => void
}

export function AddRoleForm({ form, loading, onSubmit, onCancel }: AddRoleFormProps) {
  const { t } = useTranslation()

  const handleSubmit = () => {
    console.log("Form submit event triggered")
    console.log("Form values:", form.getValues())
    console.log("Form errors:", form.formState.errors)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          handleSubmit()
          form.handleSubmit(onSubmit)(e)
        }}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="bg-background shrink-0 border-b px-6 py-4">
          <div className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md">
                    <FormLabel>{t("roles.form.name")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        placeholder={t("roles.form.name_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-muted-foreground text-sm">{t("roles.form.subtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                  {t("common.cancel")}
                </Button>
              )}
              <Button type="submit" disabled={loading} isLoading={loading}>
                {t("roles.form.create")}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto px-6 py-4">
          <div className="flex max-w-4xl flex-col gap-3">
            <h2 className="text-lg font-semibold">{t("roles.form.permissions_title")}</h2>
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
                      disabled={loading}
                    />
                  </FormControl>
                )}
              />
            ))}
          </div>
        </div>
      </form>
    </Form>
  )
}
