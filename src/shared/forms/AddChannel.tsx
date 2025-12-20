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
  setIsFolder?: (isFolder: boolean) => void
  setParentId?: (parentId: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChannelForm({
  serverId,
  open,
  onOpenChange,
  isFolder,
  setIsFolder,
  parentId,
  setParentId,
}: AddChannelFormProps) {
  const { t } = useTranslation()
  const textChannelTrad = t(`serverChannels.createChannelModal.ServerText`)
  const voiceChannelTrad = t(`serverChannels.createChannelModal.ServerVoice`)
  const folderTitleTrad = t("serverChannels.createFolderModal.title")
  const channelTitleTrad = t("serverChannels.createChannelModal.title")
  const folderNameTrad = t("serverChannels.createFolderModal.name")
  const channelNameTrad = t("serverChannels.createChannelModal.name")
  const folderNamePlaceholderTrad = t("serverChannels.createFolderModal.name_placeholder")
  const channelNamePlaceholderTrad = t("serverChannels.createChannelModal.name_placeholder")
  const typeTrad = t("serverChannels.createChannelModal.type")
  const cancelTrad = t("serverChannels.modal.cancel")
  const createFolderTrad = t("serverChannels.createFolderModal.create")
  const createChannelTrad = t("serverChannels.createChannelModal.create")
  const successFolderTrad = t("serverChannels.success_creating_folder")
  const successChannelTrad = t("serverChannels.success_creating_channel")
  const errorFolderTrad = t("serverChannels.error_creating_folder")
  const errorChannelTrad = t("serverChannels.error_creating_channel")
  const queryClient = useQueryClient()

  const {
    mutateAsync: createChannel,
    isPending: isCreatingChannel,
    isError: isCreateChannelError,
    isSuccess: isCreateChannelSuccess,
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
      toast.success(isFolder ? successFolderTrad : successChannelTrad)
    } else if (isCreateChannelError) {
      toast.error(isFolder ? errorFolderTrad : errorChannelTrad)
    }
  }, [
    isCreateChannelError,
    isCreateChannelSuccess,
    queryClient,
    serverId,
    onOpenChange,
    isFolder,
    successFolderTrad,
    successChannelTrad,
    errorFolderTrad,
    errorChannelTrad,
  ])

  useEffect(() => {
    if (!open) {
      if (setIsFolder) {
        setIsFolder(false)
      }
      if (setParentId) {
        setParentId("")
      }
      form.reset()
      console.log("reset", form)
    }
  }, [open, form, isFolder, setIsFolder, setParentId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isFolder ? folderTitleTrad : channelTitleTrad}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col justify-between gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{isFolder ? folderNameTrad : channelNameTrad}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        placeholder={
                          isFolder ? folderNamePlaceholderTrad : channelNamePlaceholderTrad
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
                    <FormLabel>{typeTrad}</FormLabel>
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
                              onCheckedChange={(checked) => {
                                console.log("check change")
                                field.onChange(checked ? ChannelTypes.TEXT : ChannelTypes.VOICE)
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={field.disabled}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                        <label htmlFor="type">
                          {field.value === ChannelTypes.TEXT ? textChannelTrad : voiceChannelTrad}
                        </label>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className={isFolder ? "py-2" : ""}>
              <DialogClose asChild>
                <Button variant="outline">{cancelTrad}</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreatingChannel} isLoading={isCreatingChannel}>
                {isFolder ? createFolderTrad : createChannelTrad}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
