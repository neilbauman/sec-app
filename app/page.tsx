"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="index"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="prose max-w-none">
        <p>
          Overview of all SSC tools and groups.
        </p>
      </div>
    </div>
  );
}
