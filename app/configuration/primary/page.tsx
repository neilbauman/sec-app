// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={breadcrumbs}
        group="Configuration"
        actions={[
          { label: "Import CSV", onClick: () => alert("Import not ready yet") },
          { label: "Export CSV", onClick: () => alert("Export not ready yet") },
        ]}
      />
      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
