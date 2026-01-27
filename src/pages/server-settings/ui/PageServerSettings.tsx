import { Button } from "@/shared/components/ui/Button"
import { Separator } from "@/shared/components/ui/Separator"
import { Link, Outlet } from "@tanstack/react-router"
import { SettingPages } from "../feature/PageServerSettingsFeature"
import { cn } from "@/shared/lib/utils"
import type { Dispatch, SetStateAction } from "react"

interface PageServerSettingsProps {
  id: string
  origin: "/servers/$id/settings"
  selectedSettingPage: SettingPages
  setSelectSettingPage: Dispatch<SetStateAction<SettingPages>>
}

export default function PageServerSettings({
  id,
  origin,
  selectedSettingPage,
  setSelectSettingPage,
}: PageServerSettingsProps) {
  console.log("PageServerSettings render", { selectedSettingPage })
  return (
    <div className="flex h-full flex-col space-y-12 p-4">
      <div className="flex h-full w-full flex-row">
        <div className="flex w-1/4 flex-col gap-y-2 p-4">
          <Button
            variant={"ghost"}
            className={cn(
              "text-responsive-lg! truncate text-left",
              selectedSettingPage === SettingPages.Profile && "bg-accent"
            )}
            asChild
          >
            <Link
              from={origin}
              to="./profile"
              params={{ id }}
              onClick={() => {
                console.log("Profile link clicked")
                setSelectSettingPage(SettingPages.Profile)
              }}
            >
              Profile
            </Link>
          </Button>
          <Button
            variant={"ghost"}
            className={cn(
              "text-responsive-lg! truncate text-left",
              selectedSettingPage === SettingPages.Roles && "bg-accent"
            )}
            asChild
          >
            <Link
              from={origin}
              to="./roles"
              params={{ id }}
              onClick={() => {
                console.log("Roles link clicked")
                setSelectSettingPage(SettingPages.Roles)
              }}
            >
              Roles
            </Link>
          </Button>
        </div>
        <Separator orientation="vertical" />
        <div className="flex w-3/4 flex-col p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
