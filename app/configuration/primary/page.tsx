// /app/configuration/primary/page.tsx
"use client";
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { Cog } from "lucide-react";
import { getFramework } from "@/lib/framework";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Define and manage the SSC framework pillars, themes, and subthemes."
        group="Configuration"
        groupIcon={Cog}
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
