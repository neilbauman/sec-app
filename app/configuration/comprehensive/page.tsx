// /app/configuration/comprehensive/page.tsx
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default function ComprehensiveFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard", "configuration", "comprehensive"]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Manage all SSC framework details including indicators."
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <div className="mt-6 p-6 border rounded-xl bg-gray-50 text-gray-500">
        Placeholder for Comprehensive Framework Editor UI
      </div>
    </main>
  );
}
