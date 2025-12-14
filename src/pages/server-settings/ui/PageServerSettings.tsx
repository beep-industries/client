import TopBar from "@/shared/components/TopBar"

interface PageServerSettingsProps {
  id: string
}

export default function PageServerSettings({ id }: PageServerSettingsProps) {
  return (
    <div>
      <TopBar />
      <h1>Server Settings - {id}</h1>
    </div>
  )
}
