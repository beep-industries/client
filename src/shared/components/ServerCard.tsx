import { useState, useRef, useEffect } from "react"
import type { Server } from "@/shared/queries/community/community.types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { cn } from "../lib/utils"
import { Check, X } from "lucide-react"

export type DescriptionSize = "small" | "medium" | "large"

interface ServerCardProps {
  server: Server
  onClick?: (server: Server) => void
  onBannerClick?: (server: Server) => void
  onPictureClick?: (server: Server) => void
  onNameChange?: (server: Server, newName: string) => void
  onDescriptionClick?: (server: Server) => void
  descriptionSize?: DescriptionSize
}

const descriptionSizeClasses: Record<DescriptionSize, string> = {
  small: "line-clamp-2 text-responsive-sm",
  medium: "line-clamp-4 text-responsive-md",
  large: "line-clamp-6 text-responsive-md",
}

export default function ServerCard({
  server,
  onClick,
  onBannerClick,
  onPictureClick,
  onNameChange,
  onDescriptionClick,
  descriptionSize = "small",
}: ServerCardProps) {
  const [bannerError, setBannerError] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(server.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingName])

  const handleClick = () => {
    if (onClick) {
      onClick(server)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  const handleBannerClick = (e: React.MouseEvent) => {
    if (onBannerClick) {
      e.stopPropagation()
      onBannerClick(server)
    }
  }

  const handlePictureClick = (e: React.MouseEvent) => {
    if (onPictureClick) {
      e.stopPropagation()
      onPictureClick(server)
    }
  }

  const handleNameClick = (e: React.MouseEvent) => {
    if (onNameChange) {
      e.stopPropagation()
      setIsEditingName(true)
    }
  }

  const handleNameSave = () => {
    setIsEditingName(false)
    if (onNameChange && nameValue !== server.name) {
      onNameChange(server, nameValue)
    }
  }

  const handleNameCancel = () => {
    setNameValue(server.name)
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleNameSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleNameCancel()
    }
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    if (onDescriptionClick) {
      e.stopPropagation()
      onDescriptionClick(server)
    }
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={cn(
        "bg-card group relative flex min-h-52 flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200",
        onClick &&
          "focus-visible:ring-ring cursor-pointer hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      )}
    >
      {/* Banner */}
      <div
        className={cn(
          "bg-muted relative h-28 w-full flex-shrink-0 overflow-hidden",
          onBannerClick && "cursor-pointer"
        )}
        onClick={handleBannerClick}
      >
        {server.banner_url && !bannerError ? (
          <img
            src={server.banner_url}
            alt={`${server.name} banner`}
            className={cn(
              "h-full w-full object-cover transition-transform",
              onClick && "group-hover:scale-105",
              onBannerClick && "hover:scale-105"
            )}
            onError={() => setBannerError(true)}
          />
        ) : (
          <div className="bg-primary/20 h-full w-full" />
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col px-3 pb-3">
        {/* Avatar positioned at the bottom-left of the banner */}
        <Avatar
          className={cn(
            "border-card absolute -top-5 left-3 h-10 w-10 rounded-lg border-4",
            onPictureClick && "hover:ring-primary cursor-pointer transition-all hover:ring-2"
          )}
          onClick={handlePictureClick}
        >
          <AvatarImage src={server.picture_url ?? undefined} alt={server.name} />
          <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
            {server.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Server info */}
        <div className="mt-6 flex flex-col gap-0.5">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={handleNameKeyDown}
                className="text-foreground text-responsive-md border-primary -mx-1 flex-1 border-b-2 bg-transparent px-1 font-semibold outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNameSave()
                }}
                className="cursor-pointer rounded p-0.5 text-gray-400 transition-colors hover:text-green-600"
                aria-label="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNameCancel()
                }}
                className="cursor-pointer rounded p-0.5 text-gray-400 transition-colors hover:text-red-600"
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <h4
              className={cn(
                "text-foreground text-responsive-md truncate font-semibold",
                onNameChange && "hover:text-primary cursor-pointer transition-colors"
              )}
              onClick={handleNameClick}
            >
              {server.name}
            </h4>
          )}
          {server.description && (
            <p
              className={cn(
                "text-muted-foreground",
                descriptionSizeClasses[descriptionSize],
                onDescriptionClick && "hover:text-primary cursor-pointer transition-colors"
              )}
              onClick={handleDescriptionClick}
            >
              {server.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
