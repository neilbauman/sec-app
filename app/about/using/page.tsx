"use client";

import PageHeader from "@/components/ui/PageHeader";
import { Info, BookOpen } from "lucide-react";

export default function UsingToolsetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group={{
          name: "About",
          icon: <Info className="w-5 h-5" />,
          color: "text-blue-600",
        }}
        page={{
          title: "Using this Toolset",
          description:
            "Guidance on how to navigate and apply the SSC toolset in practice.",
          icon: <BookOpen className="w-6 h-6" />,
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "Using this Toolset" },
        ]}
      />

      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <p className="text-gray-700">
          Here you will find detailed guidance on how to use the SSC toolset
          effectively in practice. Content to be added here…
        </p>
      </div>
    </div>
  );
}
