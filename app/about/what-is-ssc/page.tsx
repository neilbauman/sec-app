"use client";

import PageHeader from "@/components/ui/PageHeader";
import { HelpCircle, Info } from "lucide-react";

export default function WhatIsSSCPage() {
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
          title: "What is the SSC?",
          description:
            "An introduction to the Shelter and Settlement Severity Classification system and its purpose.",
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "What is the SSC?" },
        ]}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          Overview
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The Shelter and Settlement Severity Classification (SSC) provides a
          structured framework for analyzing humanitarian needs related to
          shelter and settlement conditions. It ensures that assessments are
          consistent and comparable across countries and contexts.
        </p>

        <div className="mt-6 h-48 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-400 text-sm">
            [Placeholder for conceptual diagram or explanatory infographic]
          </span>
        </div>
      </div>
    </div>
  );
}
