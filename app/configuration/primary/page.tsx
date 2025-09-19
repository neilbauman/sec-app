"use client";

import FrameworkEditor from "@/components/framework/FrameworkEditor";
import PageHeader from "@/components/ui/PageHeader";
import { toolkit, groups } from "@/lib/headerConfig";

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkit={toolkit}
        group={groups.configuration}
        page={{
          title: "Primary Framework Editor",
          description: "Define and manage pillars, themes, and subthemes of the SSC framework.",
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />
      <FrameworkEditor />
    </div>
  );
}
