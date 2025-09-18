// app/configuration/page.tsx
"use client";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import MiniCard from "@/components/ui/MiniCard";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { title: "Dashboard", href: "/" },
    { title: "Configuration", href: "/configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Configuration"
        description="Configure and manage SSC framework content."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<Cog className="w-6 h-6 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid gap-2 mt-6">
        <MiniCard
          title="Primary Framework Editor"
          href="/configuration/primary"
          icon={<FileText className="w-6 h-6 text-green-600" />}
          iconColor="text-green-600"
        />
        <MiniCard
          title="Comprehensive Framework Editor"
          href="/configuration/comprehensive"
          icon={<FileText className="w-6 h-6 text-green-600" />}
          iconColor="text-green-600"
        />
      </div>
    </main>
  );
}
