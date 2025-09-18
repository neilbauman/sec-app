"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "Configuration", href: "/configuration" },
  { label: "Primary Framework Editor" },
];

export default function PrimaryFrameworkPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Manage the simplified SSC framework."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient />
    </main>
  );
}
