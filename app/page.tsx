// /app/page.tsx
import Link from "next/link";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { Layers, Info, Cog, Globe, Database } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard"]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Dashboard"
        description="Access different modules of the Shelter and Settlement Severity Classification Toolset."
        group="Dashboard"
        icon={Layers}
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* About */}
        <Link href="/about" className="block">
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
            <Info className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-gray-600">Learn about the SSC and this toolset.</p>
          </div>
        </Link>

        {/* Configuration */}
        <Link href="/configuration" className="block">
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
            <Cog className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold">SSC Configuration</h3>
            <p className="text-sm text-gray-600">Manage the global SSC framework and defaults.</p>
          </div>
        </Link>

        {/* Country Configurations */}
        <div className="bg-white shadow rounded-xl p-6 opacity-50">
          <Globe className="w-8 h-8 text-orange-600 mb-2" />
          <h3 className="font-semibold">Country Configurations</h3>
          <p className="text-sm text-gray-600">Baseline information like place names and population.</p>
        </div>

        {/* SSC Instances */}
        <div className="bg-white shadow rounded-xl p-6 opacity-50">
          <Database className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold">SSC Instances</h3>
          <p className="text-sm text-gray-600">Run calculations and edit severity classifications.</p>
        </div>
      </div>
    </main>
  );
}
