import ToolHeader from "@/components/ui/ToolHeader";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage frameworks and SSC configuration."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration" },
        ]}
        group="configuration"
      />

      {/* Cards for Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/configuration/primary"
          className="p-6 border rounded-lg shadow hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-600">
              Primary Framework Editor
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Configure pillars, themes, and sub-themes.
          </p>
        </Link>

        <Link
          href="/configuration/comprehensive"
          className="p-6 border rounded-lg shadow hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-purple-600">
              Comprehensive Framework Editor
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Configure pillars, themes, sub-themes, and indicators.
          </p>
        </Link>
      </div>
    </div>
  );
}
