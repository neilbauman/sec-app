// /app/configuration/comprehensive/page.tsx
"use client";
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog } from "lucide-react";

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
        description="Edit the full SSC framework including all levels and indicators."
        group="Configuration"
        groupIcon={Cog}
        breadcrumbs={breadcrumbs}
      />
      <div className="mt-6 text-gray-700">
        <p>
          Comprehensive editor functionality will be developed here, allowing
          deeper editing of all SSC framework elements and relationships.
        </p>
      </div>
    </main>
  );
}
