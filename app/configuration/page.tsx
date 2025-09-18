// /app/configuration/page.tsx
"use client";
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import MiniCard from "@/components/ui/MiniCard";
import { FileText, Cog } from "lucide-react";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        groupIcon={Cog}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        <MiniCard
          title="Primary Framework Editor"
          href="/configuration/primary"
          icon={FileText}
          iconColor="bg-green-600"
          description="Define and manage the global SSC framework including pillars, themes, and subthemes."
        />
        <MiniCard
          title="Comprehensive Framework Editor"
          href="/configuration/comprehensive"
          icon={FileText}
          iconColor="bg-green-600"
          description="Manage and edit detailed framework elements, indicators, and relationships."
        />
      </div>
    </main>
  );
}
