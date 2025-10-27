import { Button } from "@/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signinFormSchema, type SigninForm } from "../types/signin-form"
import { useAuthTokens } from "@/queries/auth/auth.queries"

export function SigninForm() {
  const { mutate: authTokens } = useAuthTokens()
  const form = useForm<SigninForm>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: SigninForm) {
    authTokens(data)
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
              Singin
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
