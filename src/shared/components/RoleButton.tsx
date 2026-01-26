import { Button } from "@/shared/components/ui/Button"
import { cn } from "@/shared/lib/utils"
import { X } from "lucide-react"
import { Link } from "@tanstack/react-router"
import type { Role } from "@/shared/queries/community/community.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/Dialog"
import { useTranslation } from "react-i18next"
import { useState } from "react"

interface RoleButtonProps {
  role: Role
  serverId: string
  origin: "/servers/$id/settings/roles"
  onDelete: (roleId: string) => void
  isDeleting: boolean
  className?: string
}

export function RoleButton({
  role,
  serverId,
  origin,
  onDelete,
  isDeleting,
  className,
}: RoleButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    onDelete(role.id)
    setOpen(false)
  }

  return (
    <div className={cn("group relative flex items-center", className)}>
      <Button
        variant="ghost"
        className={cn("text-responsive-lg flex-1 truncate pr-8 text-left")}
        asChild
      >
        <Link from={origin} to="./$roleId/permissions" params={{ id: serverId, roleId: role.id }}>
          {role.name}
        </Link>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("roles.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("roles.delete.description", { roleName: role.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              {t("roles.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
