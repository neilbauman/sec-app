// /app/configuration/primary/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { getPrimaryFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { Cog, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);

  // fetch real data (server side)
  const data = await getPrimaryFramework();

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Edit the SSC primary framework."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={FileText}
        breadcrumbs={breadcrumbs}
      />

      {/* client component gets plain JSON data */}
      <PrimaryFrameworkEditorClient data={data} />
    </main>
  );
}
