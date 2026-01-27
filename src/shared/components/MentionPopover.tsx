import { useEffect, useRef, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { cn } from "../lib/utils"

export interface MentionMember {
  userId: string
  displayName: string
  avatarUrl?: string
}

interface MentionPopoverProps {
  members: MentionMember[]
  searchQuery: string
  onSelect: (member: MentionMember) => void
  position: { top: number; left: number }
  selectedIndex: number
}

export default function MentionPopover({
  members,
  searchQuery,
  onSelect,
  position,
  selectedIndex,
}: MentionPopoverProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return members.filter((member) => member.displayName.toLowerCase().includes(query)).slice(0, 10)
  }, [members, searchQuery])

  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    selectedElement?.scrollIntoView({ block: "nearest" })
  }, [selectedIndex])

  if (filteredMembers.length === 0) {
    return null
  }

  return (
    <div
      className="bg-popover border-border absolute z-50 w-64 overflow-hidden rounded-md border shadow-lg"
      style={{
        bottom: position.top,
        left: position.left,
      }}
    >
      <div ref={listRef} className="max-h-[300px] overflow-y-auto p-1">
        {filteredMembers.map((member, index) => (
          <div
            key={member.userId}
            data-index={index}
            onClick={() => onSelect(member)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
              index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
            )}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={member.avatarUrl} alt={member.displayName} />
              <AvatarFallback className="text-xs">
                {member.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{member.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
