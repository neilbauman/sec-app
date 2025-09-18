// /app/configuration/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" }, // current page
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Configuration"
        breadcrumbs={breadcrumbs}
        group="Configuration"
      />
      <p className="text-gray-600">Select a framework to edit.</p>
    </main>
  );
}
