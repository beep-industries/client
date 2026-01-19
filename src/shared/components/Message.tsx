import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"

interface MessageProps {
  content: string
  author: string
  replyTo?: string
  date: string
  edited: boolean
  profilePictureUrl?: string
}

export default function MessageComponent({ content, profilePictureUrl, author }: MessageProps) {
  return (
    <div className="flex h-fit w-full items-start gap-3 p-5">
      <Avatar className="h-8 w-8 rounded-lg grayscale">
        <AvatarImage src={profilePictureUrl} alt={author} />
        <AvatarFallback className="rounded-lg">{author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="font-semibold">{author}</h3>
        <p>{content}</p>
      </div>
    </div>
  )
}
