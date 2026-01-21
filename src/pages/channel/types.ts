export interface ParticipantStream {
  userId: string
  user: {
    display_name: string
    sub: string
    profile_picture: string
    description: string
  }
  tracks: { audio: MediaStream | null; video: MediaStream | null }
  video: boolean
  audio: boolean
}

export type LayoutType = "grid" | "spotlight" | "sidebar"
