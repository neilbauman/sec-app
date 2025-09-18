// app/about/page.tsx
"use client";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Info } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { title: "Dashboard", href: "/" },
    { title: "About", href: "/about" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}
        icon={<Info className="w-6 h-6 text-blue-600" />}
        breadcrumbs={breadcrumbs}
      />
    </main>
  );
}
