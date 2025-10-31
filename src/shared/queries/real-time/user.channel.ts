import type { TopicSpec } from "@/shared/models/real-time.ts"
import type { User } from "@/shared/models/user.ts"

export const userTopics: TopicSpec[] = [
  {
    key: "demoRandom",
    topic: ({ user }) => `user:${(user as User)?.id}`,
    events: [
      {
        event: "random",
        toState: {
          key: "random",
          initial: [] as unknown[],
          reducer: (prev: unknown[], msg) => [msg, ...prev].slice(0, 10),
        },
      },
      {
        event: "message",
        toState: {
          key: "message",
          initial: [] as unknown[],
          reducer: (prev, msg) => [msg, ...prev].slice(0, 10),
        },
      },
    ],
  },
]
