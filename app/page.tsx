"use client";

import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { toolkit, groups } from "@/lib/headerConfig";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkit={toolkit}
        group={groups.configuration}
        page={{
          title: "Dashboard",
          description: "Overview of all SSC tools and groups.",
        }}
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <Link href="/configuration">
            <h2 className="flex items-center gap-2 font-bold text-lg text-green-600">
              {groups.configuration.icon}
              {groups.configuration.name}
            </h2>
          </Link>
          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li>
              <Link href="/configuration/primary" className="text-green-600 hover:underline">
                Primary Framework Editor
              </Link>
            </li>
            <li className="text-gray-400">Comprehensive Framework Editor (coming soon)</li>
          </ul>
        </div>

        {/* About Card */}
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <Link href="/about">
            <h2 className="flex items-center gap-2 font-bold text-lg text-blue-500">
              {groups.about.icon}
              {groups.about.name}
            </h2>
          </Link>
          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li>
              <Link href="/about/using" className="text-blue-500 hover:underline">
                Using this Toolset
              </Link>
            </li>
            <li className="text-gray-400">What is the SSC? (coming soon)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
