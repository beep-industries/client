import { useEffect, useState } from "react"
import PageServerSettings from "../ui/PageServerSettings"
import { useNavigate } from "@tanstack/react-router"

interface PageServerSettingsFeatureProps {
  id: string
  origin: "/servers/$id/settings"
}

export const SettingPages = {
  Roles: "roles",
} as const

export type SettingPages = (typeof SettingPages)[keyof typeof SettingPages]

export function PageServerSettingsFeature({ id, origin }: PageServerSettingsFeatureProps) {
  const [selectSettingPage, setSelectSettingPage] = useState<SettingPages>(SettingPages.Roles)
  const navigate = useNavigate()

  // Navigate to the role page by default
  // If some settings pages are added later feel free to change it
  useEffect(() => {
    navigate({ to: `/servers/${id}/settings/${selectSettingPage}` })
  })
  return (
    <PageServerSettings
      id={id}
      origin={origin}
      selectedSettingPage={selectSettingPage}
      setSelectSettingPage={setSelectSettingPage}
    />
  )
}
