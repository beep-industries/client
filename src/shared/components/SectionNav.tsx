import type { ReactNode } from "react"
import { Button } from "./ui/Button"

interface ItemSectionNav {
  id: string
  name: ReactNode
}

interface SectionNavProps {
  sections: ItemSectionNav[]
  sectionSelected: string
  onSectionSelect: (sectionId: string) => void
}

export default function SectionNav({
  sections,
  sectionSelected,
  onSectionSelect,
}: SectionNavProps) {
  return (
    <div className="flex flex-row">
      {sections.map((section) => (
        <div
          key={section.id}
          className={
            "border-b-border hover:border-b-primary border border-transparent pb-2 hover:border" +
            (sectionSelected === section.id ? " border-b-primary" : "")
          }
        >
          <Button variant="ghost" onClick={() => onSectionSelect(section.id)}>
            {section.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
