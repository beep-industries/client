import { useEffect, useState } from "react"
import { useLocation } from "@tanstack/react-router"
import PageServerSettings from "../ui/PageServerSettings"
import { useRoles } from "@/app/providers/RoleProvider"
import { Permission } from "@/shared/models/permissions"

interface PageServerSettingsFeatureProps {
  id: string
  origin: "/servers/$id/settings"
}

export const SettingPages = {
  Roles: "roles",
  Profile: "profile",
} as const

export type SettingPages = (typeof SettingPages)[keyof typeof SettingPages]

export function PageServerSettingsFeature({ id, origin }: PageServerSettingsFeatureProps) {
  const [selectSettingPage, setSelectSettingPage] = useState<SettingPages>(SettingPages.Profile)
  const { pathname } = useLocation()
  const { permissions } = useRoles()

  useEffect(() => {
    if (pathname.endsWith("/profile")) {
      setSelectSettingPage(SettingPages.Profile)
    } else if (pathname.endsWith("/roles")) {
      setSelectSettingPage(SettingPages.Roles)
    }
  }, [pathname])

  return (
    <PageServerSettings
      id={id}
      origin={origin}
      selectedSettingPage={selectSettingPage}
      setSelectSettingPage={setSelectSettingPage}
      canManageRole={permissions.can(Permission.ManageRoles)}
    />
  )
}
