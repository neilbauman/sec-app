// /app/configuration/page.tsx
export const dynamic = "force-dynamic";

import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Configuration", href: "/configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolHeader
        title="SSC Configuration"
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-600 mt-4">
        Choose a configuration editor: Primary Framework or Comprehensive
        Framework.
      </p>
    </main>
  );
}
