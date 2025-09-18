"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Info } from "lucide-react";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "About" },
];

export default function AboutPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}
        icon={<Info className="w-5 h-5 text-blue-600" />}
        breadcrumbs={breadcrumbs}
      />
      <p className="mt-4">The SSC toolset provides a structured framework…</p>
    </main>
  );
}
