import Link from "next/link";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Dashboard"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC)."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/configuration"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-lg">Configuration</h2>
          <p className="text-sm text-gray-600">
            Manage frameworks and SSC configuration.
          </p>
        </Link>
      </div>
    </div>
  );
}
