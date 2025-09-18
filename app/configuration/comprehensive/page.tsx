import { Layers } from "lucide-react";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

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
        description="Manage the full SSC framework including indicators and criteria levels."
        group="Configuration"
        breadcrumbs={breadcrumbs}
        icon={Layers}
      />

      <p className="text-gray-600">
        Placeholder for the Comprehensive Framework Editor UI.
      </p>
    </main>
  );
}
