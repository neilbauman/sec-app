// app/page.tsx (Dashboard)

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
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <Link href="/about" className="flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-lg text-blue-500 hover:underline">
              About
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Overview of the SSC and this toolset.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li>
              <Link
                href="/about/using"
                className="text-blue-500 hover:underline"
              >
                Using this Toolset
              </Link>
            </li>
            <li>
              <Link
                href="/about/what-is-ssc"
                className="text-blue-500 hover:underline"
              >
                What is the SSC?
              </Link>
            </li>
          </ul>
        </div>

        {/* SSC Configuration */}
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <Link href="/configuration" className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-lg text-green-600 hover:underline">
              SSC Configuration
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Manage global SSC framework and defaults.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li>
              <Link
                href="/configuration/primary"
                className="text-green-600 hover:underline"
              >
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link
                href="/configuration/comprehensive"
                className="text-green-600 hover:underline"
              >
                Comprehensive Framework Editor
              </Link>
            </li>
            <li className="italic text-gray-400">Versioning (coming soon)</li>
          </ul>
        </div>

        {/* Country Configuration */}
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <Link href="/country" className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-lg text-orange-500 hover:underline">
              Country Configuration
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Configure country-level baselines, mapping, and population data.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li className="italic text-gray-400">Country Data Manager</li>
            <li className="italic text-gray-400">More tools coming soon</li>
          </ul>
        </div>

        {/* SSC Instances */}
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <Link href="/instances" className="flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-lg text-purple-600 hover:underline">
              SSC Instances
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Perform calculations and manage SSC instances.
          </p>
          <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
            <li>
              <Link
                href="/instances"
                className="text-purple-600 hover:underline"
              >
                Instance Manager
              </Link>
            </li>
            <li className="italic text-gray-400">Reports (coming soon)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
