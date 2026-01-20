import { useDocumentTitle } from "@/hooks/use-document-title"
import PageSettings from "../ui/PageSettings"

export default function PageSettingsFeature() {
  useDocumentTitle("Settings")
  return <PageSettings />
}
