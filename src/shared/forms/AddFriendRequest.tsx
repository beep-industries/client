import type { UseFormReturn } from "react-hook-form"
import type { addFriendRequestFormSchema } from "../zod/add-friend-request"
import type z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import { DialogClose, DialogFooter } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { useTranslation } from "react-i18next"

interface AddFriendRequestFormProps {
  form: UseFormReturn<z.infer<typeof addFriendRequestFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof addFriendRequestFormSchema>) => void
}

export function AddFriendRequestForm({ form, loading, onSubmit }: AddFriendRequestFormProps) {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col justify-between gap-4"
      >
        <FormField
          control={form.control}
          name="user_id_invited"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("topBar.modal.create_friend_request.user_id_invited")}</FormLabel>
              <FormControl>
                <Input type="text" id="user_id_invited" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("topBar.modal.create_friend_request.cancel")}</Button>
          </DialogClose>
          <Button type="submit" disabled={loading} isLoading={loading}>
            {t("topBar.modal.create_friend_request.create")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
