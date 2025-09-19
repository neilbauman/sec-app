"use client";

import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, Info } from "lucide-react";

export default function UsingToolsetPage() {
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
          title: "Using this Toolset",
          description:
            "Guidance on how to navigate, configure, and apply the SSC toolset in practice.",
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "Using this Toolset" },
        ]}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Getting Started
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This section will explain how to get the most out of the SSC Toolset. 
          You will find practical steps on configuring frameworks, creating 
          instances, and interpreting outputs.  
        </p>

        <div className="mt-6 h-48 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-400 text-sm">
            [Placeholder for diagrams or walkthroughs]
          </span>
        </div>
      </div>
    </div>
  );
}
