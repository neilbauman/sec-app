// /app/configuration/comprehensive/page.tsx
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import ToolsetHeader from "@/components/ui/ToolsetHeader";

export const dynamic = "force-dynamic";

export default function ComprehensiveFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Comprehensive Framework Editor" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Detailed configuration for SSC framework including indicators and criteria."
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-700">
        Placeholder: Comprehensive editor functionality will go here.
      </p>
    </main>
  );
}
