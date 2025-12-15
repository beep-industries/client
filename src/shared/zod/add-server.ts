import z from "zod"

export const addServerFormSchema = z.object({
  name: z.string().min(1, { message: "validation.firstname.required" }),
  description: z.string().optional(),
  picture_url: z.string().optional(),
  banner_url: z.string().optional(),
  visibility: z.enum(["Public", "Private"]),
})
