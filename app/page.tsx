"use client";

import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="configuration" page="dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-green-600">SSC Configuration</h2>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>
              <Link href="/configuration/primary" className="text-green-600 hover:underline">
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link href="/configuration/comprehensive" className="text-green-600 hover:underline">
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </div>

        {/* About Card */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-600">About</h2>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>
              <Link href="/about/using" className="text-blue-600 hover:underline">
                Using this Toolset
              </Link>
            </li>
            <li>
              <Link href="/about/what-is-ssc" className="text-blue-600 hover:underline">
                What is the SSC?
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
