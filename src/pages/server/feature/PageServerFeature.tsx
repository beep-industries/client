import { useParams } from "@tanstack/react-router"
import PageServer from "../ui/PageServer"

export default function PageServerFeature() {
  const { id } = useParams({ from: "/servers/$id" })

  return <PageServer id={id} />
}
