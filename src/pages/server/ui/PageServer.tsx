import TopBar from "@/shared/components/TopBar"

interface PageServerProps {
  id: string
}

export default function PageServer({ id }: PageServerProps) {
  return (
    <div>
      <TopBar />
      <h1>Server {id}</h1>
    </div>
  )
}
