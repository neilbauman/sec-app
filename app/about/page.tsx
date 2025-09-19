"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function AboutIndexPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="about" />
      <div className="prose max-w-none">
        <p>
          Welcome to the <strong>Shelter and Settlement Severity Classification Toolset</strong>.
          Use the links in this section to learn about the SSC framework and how to apply it.
        </p>
      </div>
    </div>
  );
}
