// app/configuration/comprehensive/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";

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
        description="Explore and manage the full SSC framework including indicators."
        group="Configuration"
        groupIcon={Cog}   // ✅ component type
        icon={FileText}   // ✅ component type
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-500">
        [Comprehensive framework editor UI goes here]
      </p>
    </main>
  );
}
