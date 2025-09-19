// app/about/what-is-ssc/page.tsx
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
          { label: "What is SSC?" },
        ]}
      />

      <div className="prose max-w-none">
        <p>
          The Shelter and Settlement Severity Classification (SSC) is a standardized methodology to assess the
          humanitarian needs of affected populations. It defines clear levels of severity, making analysis comparable
          across regions and over time.
        </p>
        <p>
          SSC builds on indicator frameworks and agreed benchmarks, supporting decision-makers in prioritizing
          interventions and resources.
        </p>
      </div>
    </div>
  );
}
