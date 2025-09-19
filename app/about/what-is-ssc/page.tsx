"use client";

import PageHeader from "@/components/ui/PageHeader";
import { Info, HelpCircle } from "lucide-react";

export default function WhatIsSSCPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group={{
          name: "About",
          icon: <Info className="w-5 h-5" />,
          color: "text-blue-600",
        }}
        page={{
          title: "What is the SSC?",
          description:
            "An introduction to the Shelter and Settlement Severity Classification system and its purpose.",
          icon: <HelpCircle className="w-6 h-6" />,
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "What is the SSC?" },
        ]}
      />

      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <p className="text-gray-700">
          The Shelter and Settlement Severity Classification (SSC) is designed
          to provide structured, comparable insights into humanitarian shelter
          needs across countries and contexts. Content to be added here…
        </p>
      </div>
    </div>
  );
}
