import { useServerById } from "@/shared/queries/community/community.queries"
import { useTranslation } from "react-i18next"

interface PageServerProps {
  id: string
}

export default function PageServer({ id }: PageServerProps) {
  const { data: server } = useServerById(id)
  const { t } = useTranslation()

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">{server?.name || "Server"}</h2>
        <p className="text-muted-foreground">{t("server.no_channels")}</p>
      </div>
    </div>
  )
}
