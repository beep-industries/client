import { createContext, useContext, useMemo, type PropsWithChildren } from "react"
import { useParams } from "@tanstack/react-router"
import { useUserRolesInServer, useServerById } from "@/shared/queries/community/community.queries"
import type { Role } from "@/shared/queries/community/community.types"
import { aggregateRolePermissions } from "@/shared/lib/permissions"
import { Permissions } from "@/shared/models/permissions"
import { useAuth } from "@/app/providers/KeycloakAuthProvider"

interface RoleContextProps {
  roles: Role[]
  permissions: Permissions
  isLoading: boolean
  isError: boolean
  isOwner: boolean
}

const RoleContext = createContext<RoleContextProps | null>(null)

export function RoleProvider({ children }: PropsWithChildren) {
  const { id: serverId } = useParams({ strict: false }) as { id: string }
  const { user } = useAuth()
  const {
    data: roles = [],
    isLoading: rolesLoading,
    isError: rolesError,
  } = useUserRolesInServer(serverId)
  const { data: server, isLoading: serverLoading, isError: serverError } = useServerById(serverId)

  const isOwner = useMemo(() => {
    return !!user && !!server && user.id === server.owner_id
  }, [user, server])

  const permissions = useMemo(() => {
    const aggregatedPermissions = aggregateRolePermissions(roles)
    return new Permissions(aggregatedPermissions, isOwner)
  }, [roles, isOwner])

  const isLoading = rolesLoading || serverLoading
  const isError = rolesError || serverError

  return (
    <RoleContext.Provider value={{ roles, permissions, isLoading, isError, isOwner }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRoles() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRoles must be used within a RoleProvider")
  }
  return context
}
