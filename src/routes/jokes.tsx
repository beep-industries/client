import { useRandomJoke } from "@/queries/jokes"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/jokes")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError } = useRandomJoke()
  // Get QueryClient from the context

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
    <div>
      test
      {data.joke}
    </div>
  )
}
