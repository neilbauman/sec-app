// /app/configuration/primary/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { getFramework } from "@/lib/framework";

export default async function PrimaryFrameworkEditorPage() {
  // ✅ fetch framework data server-side
  const framework = await getFramework();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        description="Configure pillars, themes, and sub-themes of the SSC framework."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />

      {/* ✅ pass framework as prop */}
      <PrimaryFrameworkEditorClient framework={framework} />
    </div>
  );
}
