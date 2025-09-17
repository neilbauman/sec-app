import ToolHeader from "@/components/ui/ToolHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Shelter and Settlements Severity Classification Toolset"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard" // will render the blue layers icon
      />

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About */}
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <span>ℹ️</span> About
          </h3>
          <p className="text-sm text-gray-600">
            Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances.
          </p>
        </div>

        {/* SSC Configuration */}
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <span>⚙️</span> SSC Configuration
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Manage framework editors and configure SSC components.
          </p>
          <ul className="list-disc list-inside text-sm text-blue-600">
            <li>
              <a href="/configuration/primary" className="hover:underline">
                Primary Framework Editor
              </a>
            </li>
            <li>
              <a href="/configuration/comprehensive" className="hover:underline">
                Comprehensive Framework Editor
              </a>
            </li>
          </ul>
        </div>

        {/* Country Configuration */}
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <span>🌐</span> Country Configuration
          </h3>
          <p className="text-sm text-gray-600">
            Set up baseline datasets and mapping boundaries.
          </p>
        </div>

        {/* SSC Instances */}
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <span>🛠️</span> SSC Instances
          </h3>
          <p className="text-sm text-gray-600">
            Manage post-disaster and secondary datasets to calculate severity scores.
          </p>
        </div>
      </div>
    </div>
  );
}
