// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import ToolHeader from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", path: "" },
    { label: "Configuration", path: "configuration" },
    { label: "Primary Framework", path: "configuration/primary" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework"
        breadcrumbs={breadcrumbs}
        group="Configuration"
      />
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
