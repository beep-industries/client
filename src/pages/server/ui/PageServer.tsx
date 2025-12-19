interface PageServerProps {
  id: string
}

export default function PageServer({ id }: PageServerProps) {
  return (
    <div>
      <h1>Server {id}</h1>
    </div>
  )
}
