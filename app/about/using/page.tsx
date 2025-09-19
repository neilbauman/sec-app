"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function UsingToolsetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="using"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "Using this toolset" },
        ]}
      />

      <div className="prose max-w-none">
        <p>
          Guidance on how to use the SSC toolset effectively.
        </p>
      </div>
    </div>
  );
}
