import TopBar from "@/shared/components/TopBar"
import { Input } from "@/shared/components/ui/Input"
import { useTranslation } from "react-i18next"
import ServerCard from "@/shared/components/ServerCard"
import type { Server } from "@/shared/queries/community/community.types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PageExploreProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  servers: Server[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onNextPage: () => void
  onPreviousPage: () => void
  isFetching: boolean
  handleServerClick?: (server: Server) => void
}

export default function PageExplore({
  searchQuery,
  onSearchChange,
  servers,
  isLoading,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  isFetching,
  handleServerClick,
}: PageExploreProps) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="from-primary/80 to-background relative m-2 flex-1 overflow-hidden rounded-sm bg-linear-to-b from-0% to-70%">
        {/* Noise filter - stays fixed */}
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-30 mix-blend-soft-light contrast-200 saturate-150"
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
        {/* Scrollable content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center gap-4 overflow-y-auto px-4 pt-[12dvh] pb-[12dvh]">
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
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="focus-visible:ring-0"
            />
          </span>
          <div className="flex w-full max-w-5xl justify-end">
            {!isLoading && (
              <div className="bg-card flex items-center gap-4 rounded-lg px-4 py-2 shadow-md">
                <button
                  onClick={onPreviousPage}
                  disabled={currentPage === 1 || isFetching}
                  className="text-foreground/80 hover:text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-foreground/80 text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={currentPage >= totalPages || isFetching}
                  className="text-foreground/80 hover:text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading ? (
              <div className="text-foreground/60 col-span-full text-center">
                {t("common.loading")}
              </div>
            ) : servers.length > 0 ? (
              servers.map((server) => (
                <ServerCard key={server.id} server={server} onClick={handleServerClick} />
              ))
            ) : (
              <div className="text-foreground/60 col-span-full text-center">
                {t("explore.no_results")}
              </div>
            )}
          </div>
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  )
}
