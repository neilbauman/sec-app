// /app/configuration/comprehensive/page.tsx
export const dynamic = "force-dynamic";

import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
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
        description="Work with a more detailed view of SSC framework elements."
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-600">Comprehensive framework editor coming soon.</p>
    </main>
  );
}
