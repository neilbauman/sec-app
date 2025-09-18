"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "Configuration" },
];

export default function ConfigurationPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<Cog className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid gap-2 mt-6">
        <a href="/configuration/primary" className="p-3 border rounded-md flex items-center gap-2 hover:bg-muted">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Primary Framework Editor</span>
        </a>
        <a href="/configuration/comprehensive" className="p-3 border rounded-md flex items-center gap-2 hover:bg-muted">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Comprehensive Framework Editor</span>
        </a>
      </div>
    </main>
  );
}
