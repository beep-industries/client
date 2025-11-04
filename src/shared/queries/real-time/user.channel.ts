import type { TopicJoinSpec } from "@/shared/models/real-time.ts"
import type { User } from "@/shared/models/user.ts"

export const userTopics: TopicJoinSpec[] = [
  {
    topic: (user) => `user:${(user as User)?.id}`,
    autoJoin: true,
  },
]
