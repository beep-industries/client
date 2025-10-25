import ky from "ky"
import { JokeApiResponseSchema, type JokeFilters, type JokeApiResponse } from "./jokes.types"

// Create a dedicated client for the JokeAPI
const jokeApi = ky.create({
  prefixUrl: "https://v2.jokeapi.dev",
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ["get"],
  },
})

// Get a single random joke
export const getRandomJoke = async (): Promise<JokeApiResponse> => {
  const response = await jokeApi.get("joke/Any").json()
  return JokeApiResponseSchema.parse(response)
}

// Get jokes with filters
export const getJokes = async (filters: JokeFilters = {}): Promise<JokeApiResponse> => {
  const searchParams = new URLSearchParams()

  // Build query parameters
  const category = filters.category || "Any"
  const url = `joke/${category}`

  if (filters.type) {
    searchParams.append("type", filters.type)
  }

  if (filters.amount && filters.amount > 1) {
    searchParams.append("amount", filters.amount.toString())
  }

  if (filters.lang) {
    searchParams.append("lang", filters.lang)
  }

  if (filters.safe !== undefined) {
    if (filters.safe) {
      searchParams.append("safe-mode", "true")
    }
  }

  // Add blacklist flags for unsafe content if safe mode is enabled
  if (filters.safe) {
    searchParams.append("blacklistFlags", "nsfw,religious,political,racist,sexist,explicit")
  }

  const response = await jokeApi.get(url, { searchParams }).json()
  return JokeApiResponseSchema.parse(response)
}

// Get joke by category
export const getJokeByCategory = async (category: string): Promise<JokeApiResponse> => {
  const response = await jokeApi.get(`joke/${category}`).json()
  return JokeApiResponseSchema.parse(response)
}

// Get multiple jokes
export const getMultipleJokes = async (amount: number = 5): Promise<JokeApiResponse> => {
  const searchParams = new URLSearchParams()
  searchParams.append("amount", Math.min(amount, 10).toString())

  const response = await jokeApi.get("joke/Any", { searchParams }).json()
  return JokeApiResponseSchema.parse(response)
}

// Get safe jokes only
export const getSafeJokes = (amount: number = 1): Promise<JokeApiResponse> => {
  return getJokes({
    amount,
    safe: true,
  })
}

// Get programming jokes
export const getProgrammingJokes = (amount: number = 1): Promise<JokeApiResponse> => {
  return getJokes({
    category: "Programming",
    amount,
  })
}
