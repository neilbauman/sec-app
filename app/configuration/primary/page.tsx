// /app/configuration/primary/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { Layers, Cog } from "lucide-react";
import Link from "next/link";
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

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
        <h3 className="text-lg font-semibold">Primary Framework Editor</h3>
        <p className="text-gray-600 text-sm">
          Define and manage the core structure of the SSC including pillars,
          themes, and subthemes.
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
        / <span className="text-gray-900">Primary</span>
      </nav>

      {/* Framework Editor */}
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
