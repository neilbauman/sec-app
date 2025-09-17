// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default async function ConfigurationPrimaryPage() {
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        group="Configuration"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
