import z from "zod"

export const updateRolePermissionsSchema = z.object({
  permissions: z.record(z.string(), z.boolean()),
})
