// /app/configuration/comprehensive/page.tsx
import ToolHeader from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ComprehensiveFrameworkPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", path: "" },
    { label: "Configuration", path: "configuration" },
    { label: "Comprehensive Framework", path: "configuration/comprehensive" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Comprehensive Framework"
        breadcrumbs={breadcrumbs}
        group="Configuration"
      />
      <p className="text-muted-foreground">Comprehensive editor coming soon.</p>
    </main>
  );
}
