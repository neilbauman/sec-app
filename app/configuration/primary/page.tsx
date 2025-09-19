// app/configuration/primary/page.tsx
"use client";

import dynamic from "next/dynamic";
import PageHeader from "@/components/ui/PageHeader";

// Load the FrameworkEditor client-side
const FrameworkEditor = dynamic(() => import("@/components/framework/FrameworkEditor"), {
  ssr: false,
});

export default function PrimaryFrameworkEditorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />
      <FrameworkEditor />
    </div>
  );
}
