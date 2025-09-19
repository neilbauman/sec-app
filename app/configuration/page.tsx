"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="index"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Configuration" }]}
      />

      <div className="prose max-w-none">
        <p>
          Manage configuration settings and access framework editors.
        </p>
      </div>
    </div>
  );
}
