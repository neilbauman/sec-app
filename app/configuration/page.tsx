import Link from "next/link";
import ToolHeader from "@/components/ui/ToolHeader";
import { Layers, ListChecks } from "lucide-react";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage frameworks and SSC configuration."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "SSC Configuration" }]}
        group="framework" // ✅ Required, ensures green cog icon matches dashboard
      />

      {/* Cards for SSC tools */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Primary Framework Editor */}
        <Link href="/configuration/primary" className="block">
          <div className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Primary Framework Editor</h3>
            </div>
            <p className="text-sm text-gray-600">
              Configure pillars, themes, and sub-themes.
            </p>
          </div>
        </Link>

        {/* Comprehensive Framework Editor */}
        <Link href="/configuration/comprehensive" className="block">
          <div className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <ListChecks className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Comprehensive Framework Editor</h3>
            </div>
            <p className="text-sm text-gray-600">
              Configure pillars, themes, sub-themes, and indicators.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
