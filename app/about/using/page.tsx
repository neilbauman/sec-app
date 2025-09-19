"use client";

import PageHeader from "@/components/ui/PageHeader";
import { toolkit, groups } from "@/lib/headerConfig";

export default function UsingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkit={toolkit}
        group={groups.about}
        page={{
          title: "Using this Toolset",
          description: "Guidance for navigating and applying the SSC toolset in practice.",
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "Using this Toolset" },
        ]}
      />
    </div>
  );
}
