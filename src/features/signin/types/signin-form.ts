import z from "zod"

export const signinFormSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string(),
})

export type SigninForm = z.infer<typeof signinFormSchema>
