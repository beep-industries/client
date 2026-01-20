import {
  useFriendInvitations,
  useFriendRequests,
} from "@/shared/queries/community/community.queries"
import { createFileRoute } from "@tanstack/react-router"
import FriendRequest from "@/shared/components/FriendRequest"
import SectionNav from "@/shared/components/SectionNav"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/friends/requests")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const [sectionSelected, setSectionSelected] = useState<string>("1")

  const { data: friendInvitations } = useFriendInvitations()
  const { data: friendRequests } = useFriendRequests()

  return (
    <div className="flex flex-col gap-4 p-4">
      <SectionNav
        sections={[
          {
            id: "1",
            name: (
              <div className="flex flex-row gap-2">
                <span>{t("friendRequests.invitations_received")}</span>
                <span className="text-muted-foreground text-sm">
                  {friendInvitations?.pages[0]?.data.length}
                </span>
              </div>
            ),
          },
          {
            id: "2",
            name: (
              <div className="flex flex-row gap-2">
                <span>{t("friendRequests.requests_sent")}</span>
                <span className="text-muted-foreground text-sm">
                  {friendRequests?.pages[0]?.data.length}
                </span>
              </div>
            ),
          },
        ]}
        sectionSelected={sectionSelected}
        onSectionSelect={setSectionSelected}
      />
      <div>
        {sectionSelected === "1"
          ? friendInvitations?.pages[0]?.data.map((request) => (
              <FriendRequest
                user_id={request.user_id_requested}
                status={request.status}
                type="received"
              />
            ))
          : friendRequests?.pages[0]?.data.map((request) => (
              <FriendRequest
                user_id={request.user_id_invited}
                status={request.status}
                type="sent"
              />
            ))}
      </div>
    </div>
  )
}
