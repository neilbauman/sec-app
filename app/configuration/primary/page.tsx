import ToolHeader from "@/components/ui/ToolHeader"
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient"

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Primary Framework Editor"
        pageDescription="Configure pillars, themes, and sub-themes."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="configuration"
      />

      <PrimaryFrameworkEditorClient />
    </div>
  )
}
