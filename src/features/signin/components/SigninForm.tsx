import { Button } from "@/shared/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/Form"
import { Input } from "@/shared/components/ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signinFormSchema, type SigninForm } from "../types/signin-form"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/app/providers/AuthProvider"

export function SigninForm() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const form = useForm<SigninForm>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: SigninForm) {
    login(data.email, data.password)
  }

  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-xs flex-col gap-3 sm:w-lg">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage className="flex items-start">{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage className="flex items-start">{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="hover:cursor-pointer">
              {t("common.signin")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
