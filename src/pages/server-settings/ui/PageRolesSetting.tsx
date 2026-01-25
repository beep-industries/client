import type { Role } from "@/shared/queries/community/community.types"

interface PageRoleSettingPageProps {
  roles: Array<Role>
}

export function PageRolesSetting({ roles }: PageRoleSettingPageProps) {
  return <div className="flex flex-row">{roles.map((role) => role.name)}</div>
}
