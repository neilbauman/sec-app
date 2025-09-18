import { Layers, Info, Cog, Globe, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-6 h-6 text-rust-600" />
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/about"
          className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md"
        >
          <Info className="w-6 h-6 text-blue-600 mb-2" />
          <h2 className="font-semibold">About</h2>
          <p className="text-sm text-gray-600">
            Overview of the SSC and toolset.
          </p>
        </a>

        <a
          href="/configuration"
          className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md"
        >
          <Cog className="w-6 h-6 text-green-600 mb-2" />
          <h2 className="font-semibold">SSC Configuration</h2>
          <p className="text-sm text-gray-600">
            Manage the SSC global framework and defaults.
          </p>
        </a>

        <a
          href="/countries"
          className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md"
        >
          <Globe className="w-6 h-6 text-purple-600 mb-2" />
          <h2 className="font-semibold">Country Configurations</h2>
          <p className="text-sm text-gray-600">
            Configure baselines like places, shapes, and populations.
          </p>
        </a>

        <a
          href="/instances"
          className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md"
        >
          <Database className="w-6 h-6 text-orange-600 mb-2" />
          <h2 className="font-semibold">SSC Instances</h2>
          <p className="text-sm text-gray-600">
            Use defaults to calculate and edit SSC instances.
          </p>
        </a>
      </div>
    </main>
  );
}
