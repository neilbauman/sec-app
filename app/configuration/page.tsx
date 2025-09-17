import Link from "next/link";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="SSC Configuration"
        description="Configure pillars, themes, sub-themes, and indicators."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
        ]}
        group="Configuration"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/configuration/primary">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">Primary Framework Editor</h2>
            <p className="text-sm text-gray-600 mt-2">
              Define pillars, themes, and sub-themes with default indicators.
            </p>
          </div>
        </Link>

        <Link href="/configuration/comprehensive">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">Comprehensive Framework Editor</h2>
            <p className="text-sm text-gray-600 mt-2">
              Extended configuration coming soon.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
