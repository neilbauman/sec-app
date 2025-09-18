// /app/configuration/page.tsx
export const dynamic = "force-dynamic";

import { Cog } from "lucide-react";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([{ label: "Dashboard", href: "/" }, { label: "Configuration" }]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        breadcrumbs={breadcrumbs}
        icon={Cog}
      />
      <p className="text-gray-600">Choose a configuration tool from the menu.</p>
    </main>
  );
}
