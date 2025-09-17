// /app/page.tsx
import Link from "next/link";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="Dashboard"
        description="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC)."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="Dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SSC Configuration card */}
        <Link href="/configuration">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer">
            <h2 className="text-lg font-semibold text-green-700">SSC Configuration</h2>
            <p className="text-gray-600">Manage frameworks and configuration settings.</p>
          </div>
        </Link>

        {/* SSC Instances card */}
        <Link href="/instances">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer">
            <h2 className="text-lg font-semibold text-purple-700">SSC Instances</h2>
            <p className="text-gray-600">Create and manage SSC assessments.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
