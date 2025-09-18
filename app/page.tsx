"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Info, Cog, Globe, Database } from "lucide-react";

const breadcrumbs: Breadcrumb[] = [{ label: "Dashboard" }];

export default function DashboardPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Dashboard"
        description="Navigate through the SSC toolset."
        group="Dashboard"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cards */}
      </div>
    </main>
  );
}
