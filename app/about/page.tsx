"use client";

import PageHeader from "@/components/ui/PageHeader";
import { Info, BookOpen, HelpCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group={{
          name: "About",
          icon: <Info className="w-5 h-5" />,
          color: "text-blue-600",
        }}
        page={{
          title: "About the SSC Toolset",
          description:
            "Learn about the SSC, its purpose, and how to use this toolset effectively.",
          icon: <Info className="w-6 h-6" />,
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/about/using-toolset"
          className="p-4 border rounded-lg shadow-sm hover:shadow transition flex items-start gap-2"
        >
          <BookOpen className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-600">Using this Toolset</h3>
            <p className="text-sm text-gray-600">
              Guidance on how to navigate and apply the SSC toolset in practice.
            </p>
          </div>
        </a>

        <a
          href="/about/what-is-ssc"
          className="p-4 border rounded-lg shadow-sm hover:shadow transition flex items-start gap-2"
        >
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-600">What is the SSC?</h3>
            <p className="text-sm text-gray-600">
              An introduction to the Shelter and Settlement Severity
              Classification system and its purpose.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
