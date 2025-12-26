import TopBar from "@/shared/components/TopBar"
import { Search } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { useTranslation } from "react-i18next"
import ServerCard from "@/shared/components/ServerCard"
import type { Server } from "@/shared/queries/community/community.types"

const serversMock: Server[] = [
  {
    id: "1",
    name: "418DO",
    description: "Serveur Beep pour DO2023-2026 :)",
    banner_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    picture_url: null,
    owner_id: "1",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "2",
    name: "Gaming Hub",
    description: "Le meilleur serveur gaming francophone",
    banner_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    picture_url: "https://i.pravatar.cc/150?img=10",
    owner_id: "2",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "3",
    name: "Music Lovers",
    description: "Partagez vos playlists et discutez musique",
    banner_url: null,
    picture_url: "https://i.pravatar.cc/150?img=20",
    owner_id: "3",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "4",
    name: "Dev Community",
    description: "Entraide et partage entre devs",
    banner_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
    picture_url: null,
    owner_id: "4",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "5",
    name: "Art & Design",
    description: "Communauté créative pour artistes",
    banner_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    picture_url: "https://i.pravatar.cc/150?img=30",
    owner_id: "5",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "6",
    name: "Anime Club",
    description: "Pour les fans d'anime et manga",
    banner_url: null,
    picture_url: null,
    owner_id: "6",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "7",
    name: "Crypto Trading",
    description: "Analyses et discussions crypto",
    banner_url: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
    picture_url: "https://i.pravatar.cc/150?img=40",
    owner_id: "7",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "8",
    name: "Book Club",
    description: "Lectures et discussions littéraires",
    banner_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    picture_url: null,
    owner_id: "8",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "9",
    name: "Photography",
    description: "Partagez vos plus belles photos",
    banner_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    picture_url: "https://i.pravatar.cc/150?img=50",
    owner_id: "9",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "10",
    name: "Fitness Squad",
    description: "Motivation et conseils fitness",
    banner_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    picture_url: null,
    owner_id: "10",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "11",
    name: "Cooking Masters",
    description: "Recettes et astuces culinaires",
    banner_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    picture_url: "https://i.pravatar.cc/150?img=55",
    owner_id: "11",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "12",
    name: "Cinema Fans",
    description: "Discussions sur les films et séries",
    banner_url: null,
    picture_url: "https://i.pravatar.cc/150?img=60",
    owner_id: "12",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "13",
    name: "Startup Hub",
    description: "Entrepreneurs et innovateurs",
    banner_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
    picture_url: null,
    owner_id: "13",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "14",
    name: "Language Exchange",
    description: "Apprenez des langues ensemble",
    banner_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
    picture_url: "https://i.pravatar.cc/150?img=65",
    owner_id: "14",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "15",
    name: "Pet Lovers",
    description: "Pour les amoureux des animaux",
    banner_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
    picture_url: null,
    owner_id: "15",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: "16",
    name: "Travel Buddies",
    description: "Partagez vos aventures de voyage",
    banner_url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
    picture_url: "https://i.pravatar.cc/150?img=70",
    owner_id: "16",
    visibility: "Public",
    created_at: "2024-01-01",
    updated_at: null,
  },
]

export default function PageExplore() {
  const { t } = useTranslation()

  const handleServerClick = (server: Server) => {
    console.log("Server clicked:", server.id, server.name)
  }

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
              className="focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="hover:bg-accent/50 shrink-0">
              <Search className="h-5 w-5" />
            </Button>
          </span>
          <div className="mt-[8dvh] grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {serversMock.map((server) => (
              <ServerCard key={server.id} server={server} onClick={handleServerClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
