import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { addServerFormSchema } from "../zod/add-server"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import { DialogClose, DialogFooter } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Switch } from "../components/ui/Switch"
import { useTranslation } from "react-i18next"

interface AddServerFormProps {
  form: UseFormReturn<z.infer<typeof addServerFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof addServerFormSchema>) => void
}

export function AddServerForm({ form, loading, onSubmit }: AddServerFormProps) {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col justify-between gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("serverNav.modal.name")}</FormLabel>
                <FormControl>
                  <Input type="text" id="name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("serverNav.modal.description")}</FormLabel>
                <FormControl>
                  <Input type="text" id="description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="picture_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("serverNav.modal.image_url")}</FormLabel>
                <FormControl>
                  <Input type="text" id="picture_url" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="banner_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("serverNav.modal.banner_url")}</FormLabel>
                <FormControl>
                  <Input type="text" id="banner_url" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("serverNav.modal.visibility")}</FormLabel>
                <div className="flex flex-row items-center gap-4">
                  <FormControl>
                    <Switch
                      id="visibility"
                      checked={field.value === "Public"}
                      onCheckedChange={(checked) => field.onChange(checked ? "Public" : "Private")}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <label>{t(`serverNav.modal.${field.value.toLowerCase()}`)}</label>
                </div>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("serverNav.modal.cancel")}</Button>
          </DialogClose>
          <Button type="submit" disabled={loading} isLoading={loading}>
            {t("serverNav.modal.create")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
