// /app/about/page.tsx
"use client";
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Info } from "lucide-react";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "About" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={Info}
        breadcrumbs={breadcrumbs}
      />
      <div className="mt-6 text-gray-700">
        <p>
          This toolset provides a structured framework for classifying and
          analyzing shelter and settlement severity. It supports global and
          country-level configurations, enabling consistent, evidence-based
          assessments.
        </p>
        <div className="mt-6">
          <img
            src="/placeholder-diagram.png"
            alt="SSC overview diagram"
            className="rounded-md border border-gray-200 shadow-sm"
          />
        </div>
      </div>
    </main>
  );
}
