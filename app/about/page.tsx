// /app/about/page.tsx
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Info } from "lucide-react";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "About" }
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About the SSC Toolset"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-6 space-y-4">
        <p className="text-gray-700">
          The Shelter and Settlement Severity Classification (SSC) Toolset provides a
          structured framework for analyzing humanitarian needs. It helps ensure
          consistent and comparable results across countries and contexts.
        </p>
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500">[Placeholder diagram/image]</span>
        </div>
      </div>
    </main>
  );
}
