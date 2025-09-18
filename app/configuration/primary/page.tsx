// /app/configuration/primary/page.tsx
export const dynamic = "force-dynamic";

import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor", href: "/configuration/primary" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        group="Configuration"
        description="Define and manage the global SSC framework including pillars, themes, and subthemes."
        breadcrumbs={breadcrumbs}
      />

      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
