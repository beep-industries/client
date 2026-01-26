import z from "zod"

export const addRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "roles.validation.name_required" })
    .max(100, { message: "roles.validation.name_too_long" }),
  permissions: z.record(z.string(), z.boolean()),
})
