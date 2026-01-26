import { useTranslation } from "react-i18next"
import type { Role } from "@/shared/queries/community/community.types"
import { MemberSearchCombobox, type SearchMember } from "@/shared/components/MemberSearchCombobox"
import { RoleMemberItem } from "@/shared/components/RoleMemberItem"
import { useMemo } from "react"

interface MemberWithId extends SearchMember {
  id: string
}

interface PageRoleMembersSettingsProps {
  role?: Role
  isLoadingRole: boolean
  isErrorRole: boolean
  allMembers: MemberWithId[]
  roleMembers: MemberWithId[]
  isLoadingMembers: boolean
  onAddMember: (memberId: string) => void
  onRemoveMember: (memberId: string) => void
  isUpdating: boolean
}

export function PageRoleMembersSettings({
  role,
  isLoadingRole,
  isErrorRole,
  allMembers,
  roleMembers,
  isLoadingMembers,
  onAddMember,
  onRemoveMember,
  isUpdating,
}: PageRoleMembersSettingsProps) {
  const { t } = useTranslation()

  const selectedMemberIds = useMemo(() => {
    return new Set(roleMembers.map((m) => m.id))
  }, [roleMembers])

  if (isLoadingRole || isLoadingMembers) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="shrink-0 border-b px-6 py-4">
          <div className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-1 animate-pulse flex-col gap-2">
              <div className="bg-muted h-8 w-1/3 rounded"></div>
              <div className="bg-muted h-5 w-1/2 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="bg-muted mb-4 h-10 w-full animate-pulse rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted h-16 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isErrorRole || !role) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-destructive text-lg">{t("roleMembers.error_loading")}</p>
        <p className="text-muted-foreground">{t("roleMembers.error_loading_subtitle")}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="bg-background shrink-0 border-b px-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{role.name}</h1>
          <p className="text-muted-foreground">
            {t("roleMembers.subtitle")} •{" "}
            {t("roleMembers.member_count", { count: roleMembers.length })}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex max-w-4xl flex-col gap-4">
          <MemberSearchCombobox
            members={allMembers}
            selectedMemberIds={selectedMemberIds}
            onSelectMember={onAddMember}
            disabled={isUpdating}
          />

          {roleMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12 text-center">
              <p className="text-lg font-medium">{t("roleMembers.no_members")}</p>
              <p className="text-muted-foreground text-sm">
                {t("roleMembers.no_members_subtitle")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {roleMembers.map((member) => (
                <RoleMemberItem
                  key={member.id}
                  memberId={member.id}
                  username={member.username}
                  avatarUrl={member.avatarUrl}
                  onRemove={onRemoveMember}
                  disabled={isUpdating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
