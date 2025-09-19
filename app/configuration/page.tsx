"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="configuration" />
      <div className="prose max-w-none">
        <p>
          Manage the SSC Configuration group of tools. From here you can access the
          <strong> Primary Framework Editor</strong>, the <strong>Comprehensive Framework Editor</strong>,
          and future versioning tools.
        </p>
      </div>
    </div>
  );
}
