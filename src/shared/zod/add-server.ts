import z from "zod"

export const addServerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "serverNav.validation.name_required" })
    .max(255, { message: "serverNav.validation.name_too_long" }),
  description: z.string().optional(),
  picture_url: z
    .string()
    .trim()
    .max(512, { message: "serverNav.validation.picture_url_too_long" })
    .optional(),
  banner_url: z
    .string()
    .trim()
    .max(512, { message: "serverNav.validation.banner_url_too_long" })
    .optional(),
  visibility: z.enum(["Public", "Private"]),
})
