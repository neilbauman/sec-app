// /app/configuration/comprehensive/page.tsx
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { groupIcons } from "@/lib/icons";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ComprehensiveFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Comprehensive Framework Editor" },
  ]);
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Detailed management of the SSC global framework."
        group="Configuration"
        groupIcon={groupIcons.configuration.icon}
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-600">Comprehensive framework editor placeholder.</p>
    </main>
  );
}
