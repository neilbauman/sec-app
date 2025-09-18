// /app/configuration/comprehensive/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { Layers, Cog } from "lucide-react";
import Link from "next/link";

export default function ComprehensiveFrameworkPage() {
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
        <h3 className="text-lg font-semibold">Comprehensive Framework Editor</h3>
        <p className="text-gray-600 text-sm">
          Advanced configuration of the SSC framework, including detailed rules
          and extended structures.
        </p>
      </div>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:underline text-gray-700">
          Dashboard
        </Link>{" "}
        /{" "}
        <Link
          href="/configuration"
          className="hover:underline text-gray-700"
        >
          Configuration
        </Link>{" "}
        / <span className="text-gray-900">Comprehensive</span>
      </nav>

      {/* Placeholder for now */}
      <p className="text-gray-600">
        Comprehensive editor not yet implemented.
      </p>
    </main>
  );
}
