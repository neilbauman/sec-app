import { ToolHeader } from "@/components/ui/ToolHeader";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/configuration/primary"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold">Primary Framework Editor</h2>
          <p className="text-sm text-gray-600">
            Configure pillars, themes, and sub-themes.
          </p>
        </a>

        <a
          href="/configuration/comprehensive"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold">Comprehensive Framework Editor</h2>
          <p className="text-sm text-gray-600">
            Configure pillars, themes, sub-themes, and indicators.
          </p>
        </a>
      </div>
    </div>
  );
}
