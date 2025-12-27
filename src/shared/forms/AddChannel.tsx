import { useForm } from "react-hook-form"
import type z from "zod"
import { addChannelFormSchema } from "../zod/add-channel"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Switch } from "../components/ui/Switch"
import { useTranslation } from "react-i18next"
import { ChannelTypes } from "@/shared/queries/community/community.types.ts"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { communityKeys, useCreateChannel } from "@/shared/queries/community/community.queries.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

interface AddChannelFormProps {
  serverId: string
  isFolder?: boolean
  parentId?: string
  setParentId?: (parentId: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChannelForm({
  serverId,
  open,
  onOpenChange,
  isFolder,
  parentId,
  setParentId,
}: AddChannelFormProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const {
    mutateAsync: createChannel,
    isPending: isCreatingChannel,
    isError: isCreateChannelError,
    isSuccess: isCreateChannelSuccess,
    reset: resetCreateChannel,
  } = useCreateChannel(serverId)

  const form = useForm<z.infer<typeof addChannelFormSchema>>({
    resolver: zodResolver(addChannelFormSchema),
    defaultValues: {
      name: "",
      channel_type: isFolder ? ChannelTypes.FOLDER : ChannelTypes.TEXT,
      parent_id: null,
    },
  })

  const onSubmit = async (values: z.infer<typeof addChannelFormSchema>) => {
    if (isFolder) {
      values.channel_type = ChannelTypes.FOLDER
    }
    if (parentId) {
      values.parent_id = parentId
    }
    await createChannel(values)
  }

  useEffect(() => {
    if (isCreateChannelSuccess) {
      queryClient.invalidateQueries({ queryKey: communityKeys.channels(serverId) })
      onOpenChange(false)
      toast.success(
        isFolder
          ? t("serverChannels.success_creating_folder")
          : t("serverChannels.success_creating_channel")
      )
      resetCreateChannel()
    } else if (isCreateChannelError) {
      toast.error(
        isFolder
          ? t("serverChannels.error_creating_folder")
          : t("serverChannels.error_creating_channel")
      )
      resetCreateChannel()
    }
  }, [
    isCreateChannelError,
    isCreateChannelSuccess,
    isFolder,
    onOpenChange,
    queryClient,
    resetCreateChannel,
    serverId,
    t,
  ])

  useEffect(() => {
    if (!open) {
      if (setParentId) {
        setParentId("")
      }
      form.reset()
    }
    if (open) {
      form.reset()
    }
  }, [open, form, setParentId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isFolder
              ? t("serverChannels.createFolderModal.title")
              : t("serverChannels.createChannelModal.title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col justify-between gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      {isFolder
                        ? t("serverChannels.createFolderModal.name")
                        : t("serverChannels.createChannelModal.name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        placeholder={
                          isFolder
                            ? t("serverChannels.createFolderModal.name_placeholder")
                            : t("serverChannels.createChannelModal.name_placeholder")
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channel_type"
                defaultValue={ChannelTypes.TEXT}
                render={({ field }) => (
                  <FormItem style={isFolder ? { display: "none" } : {}}>
                    <FormLabel>{t("serverChannels.createChannelModal.type")}</FormLabel>
                    <div className="flex flex-row items-center gap-4">
                      <div>
                        <FormControl>
                          {isFolder ? (
                            <Input
                              id="type"
                              value={ChannelTypes.FOLDER}
                              onChange={field.onChange}
                            ></Input>
                          ) : (
                            <Switch
                              id="type"
                              defaultValue={ChannelTypes.TEXT}
                              checked={field.value === ChannelTypes.TEXT}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? ChannelTypes.TEXT : ChannelTypes.VOICE)
                              }
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={field.disabled}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </div>
                      <label htmlFor="type">
                        {field.value === ChannelTypes.TEXT
                          ? t(`serverChannels.createChannelModal.ServerText`)
                          : t(`serverChannels.createChannelModal.ServerVoice`)}
                      </label>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className={isFolder ? "py-2" : ""}>
              <DialogClose asChild>
                <Button variant="outline">{t("serverChannels.modal.cancel")}</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreatingChannel} isLoading={isCreatingChannel}>
                {isFolder
                  ? t("serverChannels.createFolderModal.create")
                  : t("serverChannels.createChannelModal.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
