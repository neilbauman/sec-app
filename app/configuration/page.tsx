// /app/configuration/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { Layers, Cog } from "lucide-react";
import Link from "next/link";

export default function ConfigurationPage() {
  return (
    <main className="p-6 space-y-6">
      {/* Toolset Title */}
      <div className="flex items-center gap-2">
        <Layers className="h-6 w-6 text-orange-700" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group Title */}
      <div className="flex items-center gap-2">
        <Cog className="h-5 w-5 text-green-600" />
        <h2 className="text-xl font-semibold">SSC Configuration</h2>
      </div>
      <p className="text-gray-600">
        Manage and edit the frameworks that power the SSC calculations.
      </p>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:underline text-gray-700">
          Dashboard
        </Link>{" "}
        / <span className="text-gray-900">Configuration</span>
      </nav>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Link
          href="/configuration/primary"
          className="rounded-xl border p-4 shadow hover:shadow-md transition bg-white"
        >
          <h3 className="font-semibold text-lg">Primary Framework Editor</h3>
          <p className="text-sm text-gray-600">
            Define and manage the core pillars, themes, and subthemes.
          </p>
        </Link>

        <Link
          href="/configuration/comprehensive"
          className="rounded-xl border p-4 shadow hover:shadow-md transition bg-white"
        >
          <h3 className="font-semibold text-lg">Comprehensive Framework Editor</h3>
          <p className="text-sm text-gray-600">
            Advanced editor with more granular options (coming soon).
          </p>
        </Link>
      </div>
    </main>
  );
}
