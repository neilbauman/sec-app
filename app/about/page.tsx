"use client";

import PageHeader from "@/components/ui/PageHeader";
import { toolkit, groups, pages } from "@/lib/headerConfig";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        toolkit={toolkit}
        group={groups.about}
        page={pages.aboutToolset}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/about/using"
          className="p-4 rounded-lg border hover:shadow bg-white"
        >
          <h3 className="font-semibold text-blue-600">Using this Toolset</h3>
          <p className="text-gray-600 text-sm">
            Guidance on how to navigate and apply the SSC toolset in practice.
          </p>
        </a>
        <a
          href="/about/what"
          className="p-4 rounded-lg border hover:shadow bg-white"
        >
          <h3 className="font-semibold text-blue-600">What is the SSC?</h3>
          <p className="text-gray-600 text-sm">
            An introduction to the Shelter and Settlement Severity Classification system
            and its purpose.
          </p>
        </a>
      </div>
    </div>
  );
}
