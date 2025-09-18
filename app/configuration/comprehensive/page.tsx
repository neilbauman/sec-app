"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import ComprehensiveFrameworkEditorClient from "@/components/ui/ComprehensiveFrameworkEditorClient";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "Configuration", href: "/configuration" },
  { label: "Comprehensive Framework Editor" },
];

export default function ComprehensiveFrameworkPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Explore and manage the full SSC framework including indicators."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <ComprehensiveFrameworkEditorClient />
    </main>
  );
}
