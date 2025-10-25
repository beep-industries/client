import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getJokeByCategory,
  getJokes,
  getMultipleJokes,
  getProgrammingJokes,
  getRandomJoke,
  getSafeJokes,
} from "./jokes.api"
import type { JokeApiResponse, JokeFilters } from "./jokes.types"

// Query keys factory
export const jokeKeys = {
  all: ["jokes"] as const,
  random: () => [...jokeKeys.all, "random"] as const,
  filtered: (filters: JokeFilters) => [...jokeKeys.all, "filtered", filters] as const,
  category: (category: string) => [...jokeKeys.all, "category", category] as const,
  multiple: (amount: number) => [...jokeKeys.all, "multiple", amount] as const,
  safe: (amount: number) => [...jokeKeys.all, "safe", amount] as const,
  programming: (amount: number) => [...jokeKeys.all, "programming", amount] as const,
}

// Get a random joke
export const useRandomJoke = () => {
  return useQuery({
    queryKey: jokeKeys.random(),
    queryFn: getRandomJoke,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get jokes with filters
export const useJokes = (filters: JokeFilters = {}) => {
  return useQuery({
    queryKey: jokeKeys.filtered(filters),
    queryFn: () => getJokes(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get joke by category
export const useJokeByCategory = (category: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: jokeKeys.category(category),
    queryFn: () => getJokeByCategory(category),
    enabled: enabled && !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get multiple jokes
export const useMultipleJokes = (amount: number = 5) => {
  return useQuery({
    queryKey: jokeKeys.multiple(amount),
    queryFn: () => getMultipleJokes(amount),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get safe jokes only
export const useSafeJokes = (amount: number = 1) => {
  return useQuery({
    queryKey: jokeKeys.safe(amount),
    queryFn: () => getSafeJokes(amount),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get programming jokes
export const useProgrammingJokes = (amount: number = 1) => {
  return useQuery({
    queryKey: jokeKeys.programming(amount),
    queryFn: () => getProgrammingJokes(amount),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Infinite query for loading more jokes
export const useInfiniteJokes = (filters: JokeFilters = {}) => {
  return useInfiniteQuery({
    queryKey: [...jokeKeys.filtered(filters), "infinite"],
    queryFn: () => {
      // Since JokeAPI doesn't support pagination, we'll simulate it by fetching batches
      return getJokes({ ...filters, amount: 5 })
    },
    getNextPageParam: (_lastPage, pages) => {
      // Simulate pagination - in a real scenario with pagination, this would use actual page numbers
      return pages.length < 10 ? pages.length + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Mutation for refreshing jokes (useful for manual refresh)
export const useRefreshJokes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // This is just a placeholder mutation that triggers a refetch
      return getRandomJoke()
    },
    onSuccess: () => {
      // Invalidate all joke queries to trigger a refetch
      queryClient.invalidateQueries({ queryKey: jokeKeys.all })
    },
  })
}

// Custom hook for prefetching jokes
export const usePrefetchJokes = () => {
  const queryClient = useQueryClient()

  const prefetchRandomJoke = () => {
    queryClient.prefetchQuery({
      queryKey: jokeKeys.random(),
      queryFn: getRandomJoke,
      staleTime: 1000 * 60 * 5,
    })
  }

  const prefetchJokesByCategory = (category: string) => {
    queryClient.prefetchQuery({
      queryKey: jokeKeys.category(category),
      queryFn: () => getJokeByCategory(category),
      staleTime: 1000 * 60 * 5,
    })
  }

  const prefetchMultipleJokes = (amount: number = 5) => {
    queryClient.prefetchQuery({
      queryKey: jokeKeys.multiple(amount),
      queryFn: () => getMultipleJokes(amount),
      staleTime: 1000 * 60 * 5,
    })
  }

  return {
    prefetchRandomJoke,
    prefetchJokesByCategory,
    prefetchMultipleJokes,
  }
}

// Hook for managing joke cache
export const useJokeCache = () => {
  const queryClient = useQueryClient()

  const clearJokeCache = () => {
    queryClient.removeQueries({ queryKey: jokeKeys.all })
  }

  const invalidateJokes = () => {
    queryClient.invalidateQueries({ queryKey: jokeKeys.all })
  }

  const getJokeFromCache = (filters: JokeFilters): JokeApiResponse | undefined => {
    return queryClient.getQueryData(jokeKeys.filtered(filters))
  }

  return {
    clearJokeCache,
    invalidateJokes,
    getJokeFromCache,
  }
}
