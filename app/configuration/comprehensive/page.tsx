// app/configuration/comprehensive/page.tsx
"use client";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import ComprehensiveFrameworkEditorClient from "@/components/ui/ComprehensiveFrameworkEditorClient";
import { getFramework } from "@/lib/framework";

export default async function ComprehensiveFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { title: "Dashboard", href: "/" },
    { title: "Configuration", href: "/configuration" },
    { title: "Comprehensive Editor", href: "/configuration/comprehensive" },
  ]);

  const data = await getFramework();

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Explore and manage the full SSC framework including indicators."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-6 h-6 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <ComprehensiveFrameworkEditorClient data={data} />
    </main>
  );
}
