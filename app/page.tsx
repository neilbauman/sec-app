import Link from "next/link";
import ToolHeader from "@/components/ui/ToolHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Shelter and Settlements Severity Classification Toolset"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">ℹ️ About</h3>
          <p className="text-gray-600 text-sm">
            Welcome to the Shelter and Settlements Severity Classification
            Toolset (SSC). This tool helps configure, manage, and evaluate
            primary and comprehensive frameworks, country datasets, and SSC
            instances.
          </p>
        </div>

        {/* SSC Configuration */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">⚙️ SSC Configuration</h3>
          <p className="text-gray-600 text-sm mb-2">
            Manage framework editors and configure SSC components.
          </p>
          <ul className="list-disc list-inside text-blue-600 text-sm">
            <li>
              <Link href="/configuration/primary">Primary Framework Editor</Link>
            </li>
            <li>
              <Link href="/configuration/comprehensive">
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </div>

        {/* Country Configuration */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">🌍 Country Configuration</h3>
          <p className="text-gray-600 text-sm">
            Set up baseline datasets and mapping boundaries.
          </p>
        </div>

        {/* SSC Instances */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">📊 SSC Instances</h3>
          <p className="text-gray-600 text-sm">
            Manage post-disaster and secondary datasets to calculate severity
            scores.
          </p>
        </div>
      </div>
    </div>
  );
}
