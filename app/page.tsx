import ToolHeader from "@/components/ui/ToolHeader";
import Link from "next/link";
import { Layers, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Dashboard"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard"
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SSC Configuration */}
        <Link href="/configuration" className="p-6 border rounded-lg shadow hover:shadow-md transition bg-white">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-green-600">SSC Configuration</h2>
          </div>
          <p className="text-sm text-gray-600">
            Manage frameworks and SSC configuration tools.
          </p>
        </Link>

        {/* SSC Instances */}
        <Link href="/instances" className="p-6 border rounded-lg shadow hover:shadow-md transition bg-white">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-600">SSC Instances</h2>
          </div>
          <p className="text-sm text-gray-600">
            Create and manage SSC instance datasets.
          </p>
        </Link>
      </div>
    </div>
  );
}
