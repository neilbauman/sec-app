// /app/configuration/primary/page.tsx
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { groupIcons } from "@/lib/icons";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function PrimaryFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Define and manage the global SSC framework including pillars, themes, and subthemes."
        group="Configuration"
        groupIcon={groupIcons.configuration.icon}
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-600">Primary framework editor placeholder.</p>
    </main>
  );
}
