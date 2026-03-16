import { channelKeys } from "./channel"
import { friendKeys } from "./friend"
import { memberKeys } from "./member"
import { roleKeys } from "./role"
import { serverKeys } from "./server"
export * from "./common"
export * from "./server"
export * from "./channel"
export * from "./friend"
export * from "./member"
export * from "./role"
import ky from "ky"

class Api {
  constructor() {}
  getStoredAccessToken(): string {
    const authority = import.meta.env.VITE_KEYCLOAK_AUTHORITY
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID

    if (typeof window === "undefined" || !authority || !clientId) {
      throw new Error("OIDC storage is not available")
    }

    const storageKey = `oidc.user:${authority}:${clientId}`
    const rawUser = window.localStorage.getItem(storageKey)

    if (!rawUser) {
      throw new Error(`No OIDC user found in localStorage for key ${storageKey}`)
    }

    const user = JSON.parse(rawUser) as { access_token?: string }

    if (!user.access_token) {
      throw new Error("No access token found in OIDC user storage")
    }

    return user.access_token
  }

  createCommunityApi() {
    return ky.create({
      prefixUrl: import.meta.env.VITE_COMMUNITY_SERVICE_URL,
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${this.getStoredAccessToken()}`,
      },
    })
  }

  get requester() {
    return this.createCommunityApi()
  }
}

export const api = new Api()

export const communityKeys = {
  all: [] as const,
  servers: serverKeys.servers,
  server: serverKeys.server,
  searchServers: serverKeys.searchServers,
  searchServersPage: serverKeys.searchServersPage,
  discoverServers: serverKeys.discoverServers,
  discoverServersPage: serverKeys.discoverServersPage,
  channels: channelKeys.channels,
  channel: channelKeys.channel,
  members: memberKeys.members,
  createMember: memberKeys.createMember,
  roles: roleKeys.roles,
  role: roleKeys.role,
  roleMembers: roleKeys.roleMembers,
  userRoles: roleKeys.userRoles,
  friends: friendKeys.friends,
  friendRequests: friendKeys.friendRequests,
  friendInvitations: friendKeys.friendInvitations,
}
