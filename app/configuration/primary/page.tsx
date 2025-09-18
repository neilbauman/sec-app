// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();
  const breadcrumbs = makeBreadcrumbs(["dashboard", "configuration", "primary"]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Define and manage the global SSC framework including pillars, themes, and subthemes."
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
