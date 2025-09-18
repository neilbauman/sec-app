import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";

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
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/configuration/primary"
          className="flex items-start p-4 border rounded-lg shadow-sm hover:shadow transition bg-white"
        >
          <FileText className="w-5 h-5 text-green-600 mr-2 mt-1" />
          <div>
            <h3 className="font-semibold">Primary Framework Editor</h3>
            <p className="text-sm text-gray-600">
              Define and manage the global SSC framework including pillars, themes, and subthemes.
            </p>
          </div>
        </a>

        <a
          href="/configuration/comprehensive"
          className="flex items-start p-4 border rounded-lg shadow-sm hover:shadow transition bg-white"
        >
          <FileText className="w-5 h-5 text-green-600 mr-2 mt-1" />
          <div>
            <h3 className="font-semibold">Comprehensive Framework Editor</h3>
            <p className="text-sm text-gray-600">
              Manage and edit detailed framework elements, indicators, and relationships.
            </p>
          </div>
        </a>
      </div>
    </main>
  );
}
