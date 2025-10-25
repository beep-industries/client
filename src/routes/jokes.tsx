import { jokeKeys, useRandomJoke } from "@/queries/jokes"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { Button } from "@/shared/components/ui/button.tsx"

export const Route = createFileRoute("/jokes")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError } = useRandomJoke()
  // Get QueryClient from the context
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log("Joke data:", data)
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data) {
    return <div>Error loading joke.</div>
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        className="w-xs"
        onClick={() => {
          // Invalidate the random joke query to fetch a new joke
          queryClient.invalidateQueries({queryKey: jokeKeys.random()})
        }}
      >
       Get a new joke 
      </Button>
      {data.joke}
    </div>
  )
  
}
