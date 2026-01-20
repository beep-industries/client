import z from "zod"

export const addFriendRequestFormSchema = z.object({
  user_pseudo_invited: z
    .string()
    .trim()
    .min(1, { message: "topBar.modal.create_friend_request.user_pseudo_invited_required" }),
})
