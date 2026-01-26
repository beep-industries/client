import { useEffect, useMemo } from "react"
import {
  useServerMembers,
  useAssignRole,
  useUnassignRole,
  useRoleMembers,
} from "@/shared/queries/community/community.queries"
import { useUsersBatch } from "@/shared/queries/user/user.queries"
import { PageRoleMembersSettings } from "../ui/PageRoleMembersSettings"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { communityKeys } from "@/shared/queries/community/community.queries"
import type { Role } from "@/shared/queries/community/community.types"

interface PageRoleMembersSettingsFeatureProps {
  serverId: string
  roleId: string
  role?: Role
  isLoadingRole: boolean
  isErrorRole: boolean
}

export function PageRoleMembersSettingsFeature({
  serverId,
  roleId,
  role,
  isLoadingRole,
  isErrorRole,
}: PageRoleMembersSettingsFeatureProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  // Fetch role members with infinite scroll
  const {
    data: roleMembersData,
    isLoading: isRoleMembersLoading,
    fetchNextPage: fetchNextRoleMembersPage,
    hasNextPage: hasNextRoleMembersPage,
    isFetchingNextPage: isFetchingNextRoleMembersPage,
  } = useRoleMembers(roleId)

  // Fetch ALL server members (up to 1000) for local search
  const {
    data: membersData,
    isLoading: isMembersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServerMembers(serverId)

  // Get all unique user IDs from all pages (both server members and role members)
  const userIds = useMemo(() => {
    const ids: string[] = []
    if (membersData?.pages) {
      ids.push(...membersData.pages.flatMap((page) => page.data.map((member) => member.user_id)))
    }
    if (roleMembersData?.pages) {
      ids.push(
        ...roleMembersData.pages.flatMap((page) => page.data.map((member) => member.user_id))
      )
    }
    return [...new Set(ids)] // Remove duplicates
  }, [membersData, roleMembersData])

  // Fetch user details in batch
  const { data: usersData, isLoading: isUsersLoading } = useUsersBatch(userIds)

  // Combine member data with user details
  const allMembers = useMemo(() => {
    if (!membersData?.pages || !usersData) return []

    const userMap = new Map(usersData.map((user) => [user.sub, user]))

    return membersData.pages.flatMap((page) =>
      page.data.map((member) => {
        const user = userMap.get(member.user_id)
        const displayName = member.nickname ?? user?.display_name ?? member.user_id
        return {
          id: member.id,
          userId: member.user_id,
          username: displayName,
          avatarUrl: user?.profile_picture,
        }
      })
    )
  }, [membersData, usersData])

  // Load more members if we haven't reached 1000 yet
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && allMembers.length < 1000) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, allMembers.length, fetchNextPage])

  const {
    mutateAsync: assignRole,
    isPending: isAssigning,
    isSuccess: isAssignSuccess,
    isError: isAssignError,
    reset: resetAssign,
  } = useAssignRole()

  const {
    mutateAsync: unassignRole,
    isPending: isUnassigning,
    isSuccess: isUnassignSuccess,
    isError: isUnassignError,
    reset: resetUnassign,
  } = useUnassignRole()

  useEffect(() => {
    if (isAssignSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.roleMembers(roleId) })
      queryClient.invalidateQueries({ queryKey: communityKeys.roles(serverId) })
      toast.success(t("roleMembers.success_adding"))
      resetAssign()
    } else if (isAssignError) {
      toast.error(t("roleMembers.error_adding"))
      resetAssign()
    }
  }, [isAssignSuccess, isAssignError, queryClient, serverId, roleId, t, resetAssign])

  useEffect(() => {
    if (isUnassignSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.roleMembers(roleId) })
      queryClient.invalidateQueries({ queryKey: communityKeys.roles(serverId) })
      toast.success(t("roleMembers.success_removing"))
      resetUnassign()
    } else if (isUnassignError) {
      toast.error(t("roleMembers.error_removing"))
      resetUnassign()
    }
  }, [isUnassignSuccess, isUnassignError, queryClient, serverId, roleId, t, resetUnassign])

  const handleAddMember = async (memberId: string) => {
    await assignRole({
      role_id: roleId,
      member_id: memberId,
    })
  }

  const handleRemoveMember = async (memberId: string) => {
    await unassignRole({
      role_id: roleId,
      member_id: memberId,
    })
  }

  const currentRoleMembers = useMemo(() => {
    if (!roleMembersData?.pages || !usersData) return []

    const userMap = new Map(usersData.map((user) => [user.sub, user]))

    return roleMembersData.pages.flatMap((page) =>
      page.data.map((member) => {
        const user = userMap.get(member.user_id)
        const displayName = member.nickname ?? user?.display_name ?? member.user_id
        return {
          id: member.id,
          userId: member.user_id,
          username: displayName,
          avatarUrl: user?.profile_picture,
        }
      })
    )
  }, [roleMembersData, usersData])

  const handleRoleMembersScroll = () => {
    if (hasNextRoleMembersPage && !isFetchingNextRoleMembersPage) {
      fetchNextRoleMembersPage()
    }
  }

  return (
    <PageRoleMembersSettings
      role={role}
      isLoadingRole={isLoadingRole}
      isErrorRole={isErrorRole}
      allMembers={allMembers}
      roleMembers={currentRoleMembers}
      isLoadingMembers={isMembersLoading || isUsersLoading || isRoleMembersLoading}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      isUpdating={isAssigning || isUnassigning}
      onRoleMembersScroll={handleRoleMembersScroll}
      isFetchingMore={isFetchingNextRoleMembersPage}
    />
  )
}
