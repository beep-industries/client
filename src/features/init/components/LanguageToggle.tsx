import { Button } from "@/shared/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import { useTranslation } from "react-i18next"
import { Languages } from "lucide-react"

const languages = [
  { code: "en", name: "English", native: "English", emoji: "🌍" },
  { code: "fr", name: "French", native: "Français", emoji: "🌎" },
]

export function LanguageToggle() {
  const { i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => i18n.changeLanguage(lang.code)}>
            {lang.emoji} {lang.native} ({lang.name})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
