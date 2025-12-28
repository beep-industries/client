import z from "zod"
import { ChannelTypes } from "@/shared/queries/community/community.types.ts"

export const addChannelFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "serverChannels.validation.name_required" })
    .max(100, { message: "serverChannels.validation.name_too_long" }),
  channel_type: z.enum(Object.values(ChannelTypes)),
  parent_id: z.string().nullable().optional(),
})
