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

      {/* Page Title + Description */}
      <div>
        <h3 className="text-lg font-semibold">Configuration Overview</h3>
        <p className="text-gray-600 text-sm">
          Access the editors for managing the SSC primary and comprehensive
          frameworks.
        </p>
      </div>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:underline text-gray-700">
          Dashboard
        </Link>{" "}
        / <span className="text-gray-900">Configuration</span>
      </nav>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/configuration/primary"
          className="block p-4 border rounded-lg hover:shadow bg-white"
        >
          <h4 className="font-semibold">Primary Framework Editor</h4>
          <p className="text-sm text-gray-600">
            Configure the primary SSC framework.
          </p>
        </Link>

        <Link
          href="/configuration/comprehensive"
          className="block p-4 border rounded-lg hover:shadow bg-white"
        >
          <h4 className="font-semibold">Comprehensive Framework Editor</h4>
          <p className="text-sm text-gray-600">
            Configure advanced SSC framework details.
          </p>
        </Link>
      </div>
    </main>
  );
}
