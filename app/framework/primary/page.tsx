// /app/framework/primary/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import { getPrimaryFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function Page() {
  const framework = await getPrimaryFramework();

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        description="Manage pillars, themes, and sub-themes with their descriptions."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
