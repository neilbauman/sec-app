// /app/configuration/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog } from "lucide-react";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolHeader
        title="Configuration"
        description="Manage SSC frameworks, baselines, and related settings."
        breadcrumbs={breadcrumbs}
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-teal-600" />}
      />
      <p className="text-gray-600">
        Select a configuration tool from the menu or dashboard.
      </p>
    </main>
  );
}
