import { z } from "zod"

// Base joke schema
export const JokeSchema = z.object({
  id: z.number(),
  type: z.enum(["single", "twopart"]),
  category: z.string(),
  flags: z.object({
    nsfw: z.boolean(),
    religious: z.boolean(),
    political: z.boolean(),
    racist: z.boolean(),
    sexist: z.boolean(),
    explicit: z.boolean(),
  }),
  lang: z.string(),
  safe: z.boolean(),
})

// Single joke schema
export const SingleJokeSchema = JokeSchema.extend({
  type: z.literal("single"),
  joke: z.string(),
})

// Two-part joke schema
export const TwoPartJokeSchema = JokeSchema.extend({
  type: z.literal("twopart"),
  setup: z.string(),
  delivery: z.string(),
})

// Union of joke types
export const JokeResponseSchema = z.union([SingleJokeSchema, TwoPartJokeSchema])

// API response wrapper
export const JokeApiResponseSchema = z
  .object({
    error: z.boolean(),
    jokes: z.array(JokeResponseSchema).optional(),
    message: z.string().optional(),
    causedBy: z.array(z.string()).optional(),
    additionalInfo: z.string().optional(),
    timestamp: z.number().optional(),
  })
  .or(JokeResponseSchema)

// Query parameters
export const JokeFiltersSchema = z.object({
  category: z
    .enum(["Any", "Programming", "Miscellaneous", "Dark", "Pun", "Spooky", "Christmas"])
    .optional(),
  type: z.enum(["single", "twopart"]).optional(),
  amount: z.number().min(1).max(10).optional(),
  lang: z.string().optional(),
  safe: z.boolean().optional(),
})

// Type exports
export type Joke = z.infer<typeof JokeResponseSchema>
export type SingleJoke = z.infer<typeof SingleJokeSchema>
export type TwoPartJoke = z.infer<typeof TwoPartJokeSchema>
export type JokeApiResponse = z.infer<typeof JokeApiResponseSchema>
export type JokeFilters = z.infer<typeof JokeFiltersSchema>

// Categories enum for easier usage
export const JOKE_CATEGORIES = [
  "Any",
  "Programming",
  "Miscellaneous",
  "Dark",
  "Pun",
  "Spooky",
  "Christmas",
] as const

export type JokeCategory = (typeof JOKE_CATEGORIES)[number]
