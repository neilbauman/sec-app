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
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Framework Editors card */}
        <Link
          href="/configuration/primary"
          className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Framework Editors</h3>
          </div>
          <p className="text-gray-600">
            Manage the Primary and Comprehensive Framework editors.
          </p>
          <ul className="mt-3 list-disc list-inside text-blue-600">
            <li>
              <Link href="/configuration/primary" className="hover:underline">
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link
                href="/configuration/comprehensive"
                className="hover:underline"
              >
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </Link>
      </div>
    </div>
  );
}
