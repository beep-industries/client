import { useServerById } from "@/shared/queries/community/community.queries"
import { PageServerProfileSettings } from "../ui/PageServerProfileSettings"

interface PageServerProfileSettingsFeatureProps {
  serverId: string
}

export function PageServerProfileSettingsFeature({
  serverId,
}: PageServerProfileSettingsFeatureProps) {
  const { data, isError, isSuccess, isLoading } = useServerById(serverId)

  return (
    <PageServerProfileSettings
      server={data}
      isServerLoading={isLoading}
      isServerError={isError}
      isServerSuccess={isSuccess}
    />
  )
}
