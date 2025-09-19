"use client";

import Link from "next/link";
import { Layers, Info, Settings, Globe, Database } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkitTitle="Shelter and Settlement Severity Classification Toolset"
        group={{
          name: "Dashboard",
          icon: <Layers className="w-6 h-6 text-orange-600" />,
          color: "text-orange-600",
        }}
        page={{
          title: "Dashboard",
          description:
            "Overview of the SSC toolset groups and their tools. Start here to explore.",
        }}
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About */}
        <Link
          href="/about"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-lg">About</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Overview of the SSC and this toolset.
          </p>
        </Link>

        {/* SSC Configuration */}
        <Link
          href="/configuration"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-lg">SSC Configuration</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Manage global SSC framework and defaults.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li>Primary Framework Editor</li>
            <li>Comprehensive Framework Editor</li>
            <li className="italic text-gray-400">Versioning (coming soon)</li>
          </ul>
        </Link>

        {/* Country Configuration */}
        <Link
          href="/country"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-lg">Country Configuration</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Configure country-level baselines, mapping, and population data.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li>Country Data Manager</li>
            <li className="italic text-gray-400">More tools coming soon</li>
          </ul>
        </Link>

        {/* SSC Instances */}
        <Link
          href="/instances"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-lg">SSC Instances</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Perform calculations and manage SSC instances.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li>Instance Manager</li>
            <li className="italic text-gray-400">Reports (coming soon)</li>
          </ul>
        </Link>
      </div>
    </div>
  );
}
