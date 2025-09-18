"use client";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";
import ComprehensiveFrameworkEditorClient from "@/components/ui/ComprehensiveFrameworkEditorClient";

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
        groupIcon={Cog}
        icon={FileText}
        breadcrumbs={breadcrumbs}
      />

      {/* ✅ Safe placeholder until DB integration */}
      <ComprehensiveFrameworkEditorClient data={[]} />
    </main>
  );
}
