// /app/configuration/comprehensive/page.tsx
export const dynamic = "force-dynamic";

import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ComprehensiveFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Comprehensive Framework Editor", href: "/configuration/comprehensive" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        group="Configuration"
        description="Configure the full SSC framework including indicators and scoring."
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-6 text-muted-foreground">
        <p>
          This is where the comprehensive framework editor will live. It will
          extend the primary editor by adding indicators, scoring logic, and
          other detailed configuration tools.
        </p>
      </div>
    </main>
  );
}
