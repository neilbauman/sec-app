import ToolHeader from "@/components/ui/ToolHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Shelter and Settlements Severity Classification Toolset"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="ssc" // SSC group uses the Layers icon
      />

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            ℹ️ About
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome to the Shelter and Settlements Severity Classification
            Toolset (SSC). This tool helps configure, manage, and evaluate
            primary and comprehensive frameworks, country datasets, and SSC
            instances.
          </p>
        </div>

        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            ⚙️ SSC Configuration
          </h2>
          <p className="text-gray-600 mt-1">
            Manage framework editors and configure SSC components.
          </p>
          <ul className="list-disc list-inside mt-2 text-blue-600">
            <li>
              <a href="/configuration/primary" className="hover:underline">
                Primary Framework Editor
              </a>
            </li>
            <li>
              <a
                href="/configuration/comprehensive"
                className="hover:underline"
              >
                Comprehensive Framework Editor
              </a>
            </li>
          </ul>
        </div>

        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🌍 Country Configuration
          </h2>
          <p className="text-gray-600 mt-1">
            Set up baseline datasets and mapping boundaries.
          </p>
        </div>

        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🗄️ SSC Instances
          </h2>
          <p className="text-gray-600 mt-1">
            Manage post-disaster and secondary datasets to calculate severity
            scores.
          </p>
        </div>
      </div>
    </div>
  );
}
