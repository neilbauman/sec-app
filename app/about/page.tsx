"use client";

import PageHeader from "@/components/ui/PageHeader";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkitTitle="Shelter and Settlement Severity Classification Toolset"
        group={{
          name: "About",
          icon: <Info className="w-6 h-6 text-blue-500" />,
          color: "text-blue-500",
        }}
        page={{
          title: "About the SSC Toolset",
          description:
            "Overview of the Shelter and Settlement Severity Classification toolset.",
        }}
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "About" }]}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-700 leading-relaxed">
          The Shelter and Settlement Severity Classification (SSC) Toolset
          provides a structured framework for analyzing humanitarian needs. It
          helps ensure consistent and comparable results across countries and
          contexts.
        </p>

        <div className="mt-6 h-48 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-400 text-sm">
            [Placeholder diagram/image]
          </span>
        </div>
      </div>
    </div>
  );
}
