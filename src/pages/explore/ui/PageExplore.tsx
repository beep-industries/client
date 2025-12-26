import TopBar from "@/shared/components/TopBar"
import { Search } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { useTranslation } from "react-i18next"

export default function PageExplore() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="from-primary/80 to-background relative m-2 flex-1 overflow-hidden rounded-sm bg-linear-to-b from-0% to-70%">
        <svg
          className="absolute top-0 left-0 z-10 h-full w-full opacity-30 mix-blend-soft-light contrast-200 saturate-150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.5"
              numOctaves="1"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <div className="relative z-20 flex flex-col items-center justify-between gap-10 px-2 py-[12dvh]">
          <h2 className="text-foreground text-responsive-2xl text-center font-bold">
            {t("explore.title")}
          </h2>
          <h3 className="text-foreground/80 text-responsive-base text-center">
            {t("explore.subtitle")}
          </h3>
          <span className="bg-card flex w-full max-w-md flex-row items-center gap-2 rounded-lg p-2 shadow-md">
            <Input
              type="text"
              placeholder={t("explore.search_placeholder")}
              className="focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="hover:bg-accent/50 shrink-0">
              <Search className="h-5 w-5" />
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}
