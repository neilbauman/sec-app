// /app/configuration/page.tsx
import ToolHeader from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", path: "" },
    { label: "Configuration", path: "configuration" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Configuration"
        breadcrumbs={breadcrumbs}
        group="Configuration"
      />
      <h2 className="text-lg">Select a framework to edit</h2>
    </main>
  );
}
