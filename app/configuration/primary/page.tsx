// app/configuration/primary/page.tsx
"use client";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default function PrimaryFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Edit the SSC primary framework."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient data={[]} />
    </main>
  );
}
