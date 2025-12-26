import { Compass, Ellipsis, Inbox, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/Tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import type { Server } from "../queries/community/community.types"
import { Button } from "./ui/Button"
import { useEffect, useState } from "react"
import { useCreateServer, useServers } from "../queries/community/community.queries"
import { useInView } from "react-intersection-observer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { AddServerForm } from "../forms/AddServer"
import { useForm } from "react-hook-form"
import type z from "zod"
import { addServerFormSchema } from "../zod/add-server"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Skeleton } from "./ui/Skeleton"
import { useSkeletonLoading } from "../hooks/UseDelayedLoading"

interface NavLinkButtonProps {
  to: string
  icon: LucideIcon
  tooltip: string
}

function NavLinkButton({ to, icon: Icon, tooltip }: NavLinkButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to}>
          <Button variant="nav" size="icon-sm" aria-label={tooltip} className="cursor-pointer">
            <Icon className="text-muted-foreground h-4 w-4" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

interface ServerButtonProps {
  server: Server
}

function ServerButton({ server }: ServerButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to="/servers/$id" params={{ id: String(server.id) }}>
          <Button variant="nav" size="icon-sm" className="cursor-pointer bg-transparent">
            <Avatar className="h-7 w-7 rounded-sm">
              <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
              <AvatarFallback className="text-sm">
                {server.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{server.name}</TooltipContent>
    </Tooltip>
  )
}

function ServerButtonSkeleton() {
  return (
    <Button variant="nav" size="icon-sm" className="cursor-default bg-transparent">
      <Skeleton className="h-7 w-7 rounded-sm" />
    </Button>
  )
}

export default function ServerNav() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { ref, inView } = useInView()
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState<boolean>(false)

  const {
    data: servers,
    isError: serversError,
    isLoading: isLoadingServers,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useServers()

  const { showSkeleton, isTimeout } = useSkeletonLoading(isLoadingServers)
  const {
    mutateAsync: createServer,
    isPending: isCreatingServer,
    isError: isCreateServerError,
    isSuccess: isCreateServerSuccess,
    data: createdServer,
  } = useCreateServer()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Handle errors and timeout
  useEffect(() => {
    if (serversError || isTimeout) {
      toast.error(t("serverNav.error_loading_servers"))
    }
  }, [serversError, isTimeout, t])

  const addServerForm = useForm<z.infer<typeof addServerFormSchema>>({
    resolver: zodResolver(addServerFormSchema),
    defaultValues: {
      name: "",
      description: "",
      picture_url: "",
      banner_url: "",
      visibility: "Public",
    },
  })

  const onSubmitAddServer = async (values: z.infer<typeof addServerFormSchema>) => {
    createServer({
      name: values.name,
      description: values.description,
      picture_url: values.picture_url,
      banner_url: values.banner_url,
      visibility: values.visibility,
    })
  }

  useEffect(() => {
    if (isCreateServerSuccess) {
      queryClient.invalidateQueries({ queryKey: ["servers"] })
      setIsCreateServerModalOpen(false)
      navigate({ to: `/servers/${(createdServer as Server).id}` })
      toast.success(t("serverNav.success_creating_server"))
    } else if (isCreateServerError) {
      toast.error(t("serverNav.error_creating_server"))
    }
  }, [isCreateServerError, isCreateServerSuccess, createdServer, t, queryClient, navigate])

  useEffect(() => {
    if (!isCreateServerModalOpen) {
      addServerForm.reset()
    }
  }, [isCreateServerModalOpen, addServerForm])

  return (
    <nav className="bg-sidebar border-sidebar-border flex h-screen flex-col items-center gap-2 border-l p-2">
      <NavLinkButton to="/messages" icon={Inbox} tooltip={t("serverNav.messages")} />
      <NavLinkButton to="/explore" icon={Compass} tooltip={t("serverNav.explore")} />

      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="nav" size="icon-sm" className="cursor-pointer">
                <Ellipsis className="text-muted-foreground h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{t("serverNav.more_options")}</TooltipContent>
          <DropdownMenuContent side="left" align="start" sideOffset={4}>
            <DropdownMenuItem
              className="text-responsive-base!"
              onSelect={(e) => {
                e.preventDefault()
                setIsCreateServerModalOpen(true)
              }}
            >
              {t("serverNav.create_server")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-responsive-base!">
              {t("serverNav.join_server")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>

      <div className="no-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto">
        {showSkeleton
          ? Array.from({ length: 5 }).map((_, index) => <ServerButtonSkeleton key={index} />)
          : servers?.pages
              .flatMap((page) => page.data)
              .map((server) => <ServerButton key={server.id} server={server} />)}
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        ></button>
      </div>

      <Dialog open={isCreateServerModalOpen} onOpenChange={setIsCreateServerModalOpen}>
        <form>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("serverNav.modal.title")}</DialogTitle>
            </DialogHeader>
            <AddServerForm
              form={addServerForm}
              loading={isCreatingServer}
              onSubmit={onSubmitAddServer}
            />
          </DialogContent>
        </form>
      </Dialog>
    </nav>
  )
}
