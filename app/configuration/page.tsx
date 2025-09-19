"use client";

import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { Settings, FileText } from "lucide-react";

export default function ConfigurationGroupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkitTitle="Shelter and Settlement Severity Classification Toolset"
        group={{
          name: "Configuration",
          icon: <Settings className="w-6 h-6 text-green-600" />,
          color: "text-green-600",
        }}
        page={{
          title: "SSC Configuration",
          description: "Manage the SSC global framework and defaults.",
        }}
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Configuration" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Framework Editor */}
        <Link
          href="/configuration/primary"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-lg">Primary Framework Editor</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Define and manage the global SSC framework including pillars, themes,
            and subthemes.
          </p>
        </Link>

        {/* Comprehensive Framework Editor */}
        <Link
          href="/configuration/comprehensive"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-lg">Comprehensive Framework Editor</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Manage and edit detailed framework elements, indicators, and
            relationships.
          </p>
        </Link>
      </div>
    </div>
  );
}
