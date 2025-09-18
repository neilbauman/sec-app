// /app/configuration/primary/page.tsx
export const dynamic = "force-dynamic";

import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default async function PrimaryFrameworkPage() {
  let framework = [];
  try {
    framework = await getFramework();
  } catch (err) {
    console.error("❌ Error fetching framework:", err);
  }

  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework", href: "/configuration/primary" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={breadcrumbs}
        group="Configuration"
        // ❌ removed onClick functions
        actions={[
          { label: "Import CSV" },
          { label: "Export CSV" },
        ]}
      />
      {framework && framework.length > 0 ? (
        <PrimaryFrameworkEditorClient data={framework} />
      ) : (
        <p className="text-gray-500">⚠ No framework data available.</p>
      )}
    </main>
  );
}
