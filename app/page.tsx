// app/page.tsx
import Link from "next/link";
import { Info, Settings } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="index"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About card */}
        <Link
          href="/about"
          className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
          </div>
          <p className="text-sm text-gray-600">
            Learn about the SSC, its purpose, and how to use this toolset effectively.
          </p>
        </Link>

        {/* Configuration card */}
        <Link
          href="/configuration"
          className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          </div>
          <p className="text-sm text-gray-600">
            Manage and adjust the global configuration of the SSC toolset, including framework editors.
          </p>
        </Link>
      </div>
    </div>
  );
}
