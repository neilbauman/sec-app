// app/page.tsx
import Link from "next/link";
import { Info, Settings, Map, Layers } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="dashboard"
        page="index"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About */}
        <Link
          href="/about"
          className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Learn about the SSC, its purpose, and how to use this toolset effectively.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/about/what-is-ssc" className="text-blue-600 hover:underline">What is SSC?</Link>
            <Link href="/about/using" className="text-blue-600 hover:underline">Using the Toolset</Link>
          </div>
        </Link>

        {/* Configuration */}
        <Link
          href="/configuration"
          className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Manage and adjust the global configuration of the SSC toolset, including framework editors.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/configuration/primary" className="text-green-600 hover:underline">Framework</Link>
            <Link href="/configuration/settings" className="text-green-600 hover:underline">Settings</Link>
          </div>
        </Link>

        {/* Country Configuration */}
        <Link
          href="/country"
          className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Map className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Country Configuration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Configure SSC toolsets for specific countries and contexts.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/country/list" className="text-red-600 hover:underline">Country List</Link>
            <Link href="/country/new" className="text-red-600 hover:underline">Add Country</Link>
          </div>
        </Link>

        {/* SSC Instances */}
        <Link
          href="/instances"
          className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">SSC Instances</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            View and manage SSC instances for specific operations or organizations.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/instances/list" className="text-amber-600 hover:underline">All Instances</Link>
            <Link href="/instances/new" className="text-amber-600 hover:underline">Create New</Link>
          </div>
        </Link>
      </div>
    </div>
  );
}
