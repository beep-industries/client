import { Permission } from "@/shared/models/permissions"

export interface PermissionMetadata {
  key: string
  nameKey: string
  descriptionKey: string
  value: number
}

export const PERMISSION_METADATA: PermissionMetadata[] = [
  {
    key: "Administrator",
    nameKey: "rolePermissions.permissions.Administrator.name",
    descriptionKey: "rolePermissions.permissions.Administrator.description",
    value: Permission.Administrator,
  },
  {
    key: "ManageServer",
    nameKey: "rolePermissions.permissions.ManageServer.name",
    descriptionKey: "rolePermissions.permissions.ManageServer.description",
    value: Permission.ManageServer,
  },
  {
    key: "ManageRoles",
    nameKey: "rolePermissions.permissions.ManageRoles.name",
    descriptionKey: "rolePermissions.permissions.ManageRoles.description",
    value: Permission.ManageRoles,
  },
  {
    key: "CreateInvitation",
    nameKey: "rolePermissions.permissions.CreateInvitation.name",
    descriptionKey: "rolePermissions.permissions.CreateInvitation.description",
    value: Permission.CreateInvitation,
  },
  {
    key: "ManageChannels",
    nameKey: "rolePermissions.permissions.ManageChannels.name",
    descriptionKey: "rolePermissions.permissions.ManageChannels.description",
    value: Permission.ManageChannels,
  },
  {
    key: "ManageWebhooks",
    nameKey: "rolePermissions.permissions.ManageWebhooks.name",
    descriptionKey: "rolePermissions.permissions.ManageWebhooks.description",
    value: Permission.ManageWebhooks,
  },
  {
    key: "ViewChannels",
    nameKey: "rolePermissions.permissions.ViewChannels.name",
    descriptionKey: "rolePermissions.permissions.ViewChannels.description",
    value: Permission.ViewChannels,
  },
  {
    key: "SendMessages",
    nameKey: "rolePermissions.permissions.SendMessages.name",
    descriptionKey: "rolePermissions.permissions.SendMessages.description",
    value: Permission.SendMessages,
  },
  {
    key: "ManageNicknames",
    nameKey: "rolePermissions.permissions.ManageNicknames.name",
    descriptionKey: "rolePermissions.permissions.ManageNicknames.description",
    value: Permission.ManageNicknames,
  },
  {
    key: "ChangeNickname",
    nameKey: "rolePermissions.permissions.ChangeNickname.name",
    descriptionKey: "rolePermissions.permissions.ChangeNickname.description",
    value: Permission.ChangeNickname,
  },
  {
    key: "ManageMessages",
    nameKey: "rolePermissions.permissions.ManageMessages.name",
    descriptionKey: "rolePermissions.permissions.ManageMessages.description",
    value: Permission.ManageMessages,
  },
  {
    key: "AttachFiles",
    nameKey: "rolePermissions.permissions.AttachFiles.name",
    descriptionKey: "rolePermissions.permissions.AttachFiles.description",
    value: Permission.AttachFiles,
  },
]

export function permissionsToRecord(permissionMask: number): Record<string, boolean> {
  const record: Record<string, boolean> = {}

  PERMISSION_METADATA.forEach((perm) => {
    record[perm.key] = (permissionMask & perm.value) === perm.value
  })

  return record
}

export function recordToPermissions(record: Record<string, boolean>): number {
  let permissionMask = 0

  PERMISSION_METADATA.forEach((perm) => {
    if (record[perm.key]) {
      permissionMask |= perm.value
    }
  })

  return permissionMask
}
