import { ToolHeader } from "@/components/ui/ToolHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Shelter and Settlements Severity Classification Toolset"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard"
      />

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="#"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold">About</h2>
          <p className="text-sm text-gray-600">
            Learn more about the SSC Toolset.
          </p>
        </a>

        <a
          href="/configuration"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold">SSC Configuration</h2>
          <p className="text-sm text-gray-600">
            Manage framework editors and SSC components.
          </p>
        </a>

        <a
          href="/country"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold">Country Configuration</h2>
          <p className="text-sm text-gray-600">
            Set up baseline datasets and mapping boundaries.
          </p>
        </a>

        <a
          href="/instances"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold">SSC Instances</h2>
          <p className="text-sm text-gray-600">
            Manage datasets to calculate severity scores.
          </p>
        </a>
      </div>
    </div>
  );
}
