import { createContext, useContext, useState, type ReactNode } from "react"

interface SidebarContentContextProps {
  header: ReactNode | null
  setHeader: (header: ReactNode | null) => void
  content: ReactNode | null
  setContent: (content: ReactNode | null) => void
}

const SidebarContentContext = createContext<SidebarContentContextProps | null>(null)

export function SidebarContentProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<ReactNode | null>(null)
  const [content, setContent] = useState<ReactNode | null>(null)

  return (
    <SidebarContentContext.Provider value={{ header, setHeader, content, setContent }}>
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
