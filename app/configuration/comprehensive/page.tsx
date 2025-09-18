// /app/configuration/comprehensive/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import ComprehensiveFrameworkEditorClient from "@/components/ui/ComprehensiveFrameworkEditorClient";
import { getFramework } from "@/lib/framework";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ComprehensiveFrameworkPage() {
  const framework = await getFramework();
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Comprehensive Framework Editor" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Explore and manage the full SSC framework including indicators."
        group="Configuration"
        groupIcon={Cog}           // ✅ pass component
        icon={FileText}           // ✅ page icon
        breadcrumbs={breadcrumbs}
      />
      <ComprehensiveFrameworkEditorClient data={framework} />
    </main>
  );
}
