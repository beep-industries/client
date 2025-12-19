import z from "zod"

export const addFriendRequestFormSchema = z.object({
  user_id_invited: z
    .string()
    .trim()
    .length(36, { message: "topBar.modal.create_friend_request.user_id_invited_invalid" }),
})
