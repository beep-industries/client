import { useState } from "react"
import { Check, UserPlus } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/Popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar"
import { cn } from "@/shared/lib/utils"
import { useTranslation } from "react-i18next"

export interface SearchMember {
  id: string
  username: string
  avatarUrl?: string
}

interface MemberSearchComboboxProps {
  members: SearchMember[]
  selectedMemberIds: Set<string>
  onSelectMember: (memberId: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MemberSearchCombobox({
  members,
  selectedMemberIds,
  onSelectMember,
  disabled = false,
  placeholder,
}: MemberSearchComboboxProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const availableMembers = members.filter((member) => !selectedMemberIds.has(member.id))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start"
          disabled={disabled}
        >
          <UserPlus className="mr-2 size-4" />
          {placeholder || t("roleMembers.add_member")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("roleMembers.search_placeholder")} />
          <CommandList>
            <CommandEmpty>{t("roleMembers.no_results")}</CommandEmpty>
            <CommandGroup>
              {availableMembers.map((member) => (
                <CommandItem
                  key={member.id}
                  value={`${member.username}-${member.id}`}
                  onSelect={() => {
                    onSelectMember(member.id)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage src={member.avatarUrl} alt={member.username} />
                    <AvatarFallback className="rounded-md text-xs">
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{member.username}</span>
                  <Check
                    className={cn(
                      "size-4",
                      selectedMemberIds.has(member.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
