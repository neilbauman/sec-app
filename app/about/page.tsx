"use client";

import PageHeader from "@/components/ui/PageHeader";
import { toolkit, groups } from "@/lib/headerConfig";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkit={toolkit}
        group={groups.about}
        page={{
          title: "About the SSC Toolset",
          description: "Learn about the SSC, its purpose, and how to use this toolset effectively.",
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About the SSC Toolset" },
        ]}
      />
    </div>
  );
}
