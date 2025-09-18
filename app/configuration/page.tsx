import { Cog, Layers } from "lucide-react";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        breadcrumbs={breadcrumbs}
        icon={Cog}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <a
          href="/configuration/primary"
          className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md"
        >
          <Layers className="w-6 h-6 text-blue-600 mb-2" />
          <h2 className="font-semibold">Primary Framework Editor</h2>
          <p className="text-sm text-gray-600">
            Define and manage the global SSC framework including pillars, themes,
            and subthemes.
          </p>
        </a>

        <a
          href="/configuration/comprehensive"
          className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md"
        >
          <Layers className="w-6 h-6 text-green-600 mb-2" />
          <h2 className="font-semibold">Comprehensive Framework Editor</h2>
          <p className="text-sm text-gray-600">
            Manage the complete SSC framework, including indicators and criteria
            levels.
          </p>
        </a>
      </div>
    </main>
  );
}
