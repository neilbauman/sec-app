import Link from "next/link";
import ToolHeader from "@/components/ui/ToolHeader";

export default function SSCConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage frameworks and SSC configuration."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration" },
        ]}
        group="ssc"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Framework Editors */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">📚 Framework Editors</h3>
          <p className="text-gray-600 text-sm mb-2">
            Manage the Primary and Comprehensive Framework editors.
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
      </div>
    </div>
  );
}
