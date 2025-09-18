import { Layers } from "lucide-react";
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Define and manage the SSC framework pillars, themes, and subthemes."
        group="Configuration"
        breadcrumbs={breadcrumbs}
        icon={Layers}
        actions={[
          { label: "Import CSV" },
          { label: "Export CSV" },
        ]}
      />

      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
