import { create } from "zustand"
import type { Folder } from "@/shared/components/ServerChannels.tsx"

export const useFolder = create<{ folders: Folder[]; setFolders: (folders: Folder[]) => void }>(
  (set) => ({
    folders: [] as Folder[],
    setFolders: (folders: Folder[]) => {
      // console.log("setting state", folders)
      set({ folders: folders })
    },
  })
)
