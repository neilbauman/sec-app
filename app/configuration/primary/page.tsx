// app/configuration/primary/page.tsx
"use client";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { getPillars } from "@/lib/framework";

export default async function PrimaryFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { title: "Dashboard", href: "/" },
    { title: "Configuration", href: "/configuration" },
    { title: "Primary Editor", href: "/configuration/primary" },
  ]);

  const data = await getPillars();

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Manage the SSC global framework pillars."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-6 h-6 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient data={data} />
    </main>
  );
}
