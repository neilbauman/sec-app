import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        description="Manage pillars, themes, and sub-themes."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />

      <PrimaryFrameworkEditorClient />
    </div>
  );
}
