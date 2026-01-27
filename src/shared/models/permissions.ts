export const Permission = {
  Administrator: 0x1,
  ManageServer: 0x2,
  ManageRoles: 0x4,
  CreateInvitation: 0x8,
  ManageChannels: 0x10,
  ManageWebhooks: 0x20,
  ViewChannels: 0x40,
  SendMessages: 0x80,
  ManageNicknames: 0x100,
  ChangeNickname: 0x200,
  ManageMessages: 0x400,
  AttachFiles: 0x800,
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]

export class Permissions {
  permissionMask: number
  isOwner: boolean

  constructor(permissionMask: number, isOwner: boolean = false) {
    this.permissionMask = permissionMask
    this.isOwner = isOwner
  }

  can(permission: Permission): boolean {
    if (this.isOwner) return true
    return (this.permissionMask & permission) === permission
  }

  permissions(): Permission[] {
    if (this.isOwner) {
      return Object.values(Permission) as Permission[]
    }
    const permissions: Permission[] = []
    for (const perm in Permission) {
      const permValue = Permission[perm as keyof typeof Permission]
      if (this.can(permValue)) {
        permissions.push(permValue)
      }
    }
    return permissions
  }
}
