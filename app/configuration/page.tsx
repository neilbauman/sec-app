"use client";

import PageHeader from "@/components/ui/PageHeader";
import { FileText, Settings } from "lucide-react";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group={{
          name: "Configuration",
          icon: <Settings className="w-5 h-5" />,
          color: "text-green-600",
        }}
        page={{
          title: "SSC Configuration",
          description: "Manage the SSC global framework and defaults.",
          icon: <FileText className="w-6 h-6" />,
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/configuration/primary"
          className="p-4 border rounded-lg shadow-sm hover:shadow transition flex items-start gap-2"
        >
          <FileText className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-600">
              Primary Framework Editor
            </h3>
            <p className="text-sm text-gray-600">
              Define and manage the global SSC framework including pillars,
              themes, and subthemes.
            </p>
          </div>
        </a>

        <a
          href="/configuration/comprehensive"
          className="p-4 border rounded-lg shadow-sm hover:shadow transition flex items-start gap-2"
        >
          <FileText className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-600">
              Comprehensive Framework Editor
            </h3>
            <p className="text-sm text-gray-600">
              Manage and edit detailed framework elements, indicators, and
              relationships.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
