import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { getPrimaryFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);

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
      <PrimaryFrameworkEditorClient data={data} />
    </main>
  );
}
