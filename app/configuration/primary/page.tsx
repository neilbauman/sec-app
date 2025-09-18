// app/configuration/primary/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export const dynamic = "force-dynamic";

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
        description="Define and manage the SSC framework pillars, themes, and subthemes."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}   // ✅ JSX
        icon={<FileText className="w-5 h-5 text-rust-600" />}    // ✅ JSX
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient />
    </main>
  );
}
