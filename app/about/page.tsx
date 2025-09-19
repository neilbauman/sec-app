"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="index"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "About" }]}
      />

      <div className="prose max-w-none">
        <p>
          Welcome to the <strong>Shelter and Settlement Severity Classification Toolset</strong>.
        </p>
      </div>
    </div>
  );
}
