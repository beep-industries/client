import { createContext, useContext, useState, type ReactNode } from "react"

interface SidebarContentContextProps {
  content: ReactNode | null
  setContent: (content: ReactNode | null) => void
}

const SidebarContentContext = createContext<SidebarContentContextProps | null>(null)

export function SidebarContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null)

  return (
    <SidebarContentContext.Provider value={{ content, setContent }}>
      {children}
    </SidebarContentContext.Provider>
  )
}

export function useSidebarContent() {
  const context = useContext(SidebarContentContext)
  if (!context) {
    throw new Error("useSidebarContent must be used within a SidebarContentProvider")
  }
  return context
}
