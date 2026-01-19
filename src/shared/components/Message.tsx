interface MessageProps {
  content: string
  authorId: string
  replyTo?: string
  date: string
  edited: boolean
  profilePictureUrl?: string
}

export default function MessageComponent({ content, profilePictureUrl }: MessageProps) {
  return (
    <div className="flex h-fit w-full items-start p-5">
      {profilePictureUrl && (
        <img
          src={profilePictureUrl}
          alt="Profile Picture"
          className="mr-4 h-10 w-10 rounded-full"
        />
      )}
      <p>{content}</p>
    </div>
  )
}
