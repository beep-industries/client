import type { Role } from "@/shared/queries/community/community.types"
import { PageRolesSetting } from "../ui/PageRolesSetting"

// interface PageRolesSettingFeatureProps {
//
// }

export function PageRolesSettingFeature() {
  const roles: Array<Role> = [
    {
      name: "roles test",
      id: "yea",
      server_id: "hey",
      permissions: 1,
      created_at: "test",
      updated_at: null,
    },
  ]
  return <PageRolesSetting roles={roles} />
}
