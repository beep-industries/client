interface PageServerSettingsProps {
  id: string
}

export default function PageServerSettings({ id }: PageServerSettingsProps) {
  return (
    <div>
      <h1>Server Settings - {id}</h1>
    </div>
  )
}
