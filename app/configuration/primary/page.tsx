// app/configuration/primary/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";

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
        groupIcon={Cog}   // ✅ pass component type
        icon={FileText}
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-500">[Primary framework editor UI goes here]</p>
    </main>
  );
}
