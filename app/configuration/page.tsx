import Link from "next/link";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Configuration"
        pageDescription="Manage frameworks and SSC configuration."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
        ]}
        group="configuration"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/configuration/primary"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-lg">Primary Framework Editor</h2>
          <p className="text-sm text-gray-600">
            Configure pillars, themes, and sub-themes.
          </p>
        </Link>
        <Link
          href="/configuration/comprehensive"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md"
        >
          <h2 className="font-semibold text-lg">
            Comprehensive Framework Editor
          </h2>
          <p className="text-sm text-gray-600">
            Configure pillars, themes, sub-themes, and indicators.
          </p>
        </Link>
      </div>
    </div>
  );
}
