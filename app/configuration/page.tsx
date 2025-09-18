// /app/configuration/page.tsx
export const dynamic = "force-dynamic";

import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Configuration"
        breadcrumbs={breadcrumbs}
        group="Configuration"
      />
      <p className="text-gray-600">Choose a framework to configure.</p>
    </main>
  );
}
