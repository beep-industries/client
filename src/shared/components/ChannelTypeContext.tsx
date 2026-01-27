import { createContext, useContext, useState } from "react"

export type ChannelType = "ServerText" | "ServerVoice" | null

interface ChannelTypeContextValue {
  channelType: ChannelType
  setChannelType: (type: ChannelType) => void
}

const ChannelTypeContext = createContext<ChannelTypeContextValue | undefined>(undefined)

export function ChannelTypeProvider({ children }: { children: React.ReactNode }) {
  const [channelType, setChannelType] = useState<ChannelType>(null)
  return (
    <ChannelTypeContext.Provider value={{ channelType, setChannelType }}>
      {children}
    </ChannelTypeContext.Provider>
  )
}

export function useChannelType() {
  const ctx = useContext(ChannelTypeContext)
  if (!ctx) throw new Error("useChannelType must be used within ChannelTypeProvider")
  return ctx
}
