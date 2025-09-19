"use client";

import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="configuration" page="primaryFramework" />
      <FrameworkEditor />
    </div>
  );
}
