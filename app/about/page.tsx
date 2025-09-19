// app/about/page.tsx (About Group Page)

"use client";

import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { Info, BookOpen, HelpCircle } from "lucide-react";

export default function AboutGroupPage() {
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
          title: (
            <span className="flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500" />
              About the SSC Toolset
            </span>
          ),
          description:
            "Learn about the SSC, its purpose, and how to use this toolset effectively.",
        }}
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "About" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Using this toolset */}
        <Link
          href="/about/using"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-lg text-blue-500">
              Using this Toolset
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Guidance on how to navigate and apply the SSC toolset in practice.
          </p>
        </Link>

        {/* What is the SSC? */}
        <Link
          href="/about/what-is-ssc"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-lg text-blue-500">
              What is the SSC?
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            An introduction to the Shelter and Settlement Severity
            Classification system and its purpose.
          </p>
        </Link>
      </div>
    </div>
  );
}
