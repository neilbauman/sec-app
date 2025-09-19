"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function WhatIsSSCPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="what-is-ssc"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "What is the SSC?" },
        ]}
      />

      <div className="prose max-w-none">
        <p>
          Information on what the SSC is, its purpose, and context.
        </p>
      </div>
    </div>
  );
}
