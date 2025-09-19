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
          <strong>What is SSC?</strong> The Shelter and Settlement Severity
          Classification (SSC) is a structured framework used to assess and
          classify humanitarian shelter and settlement needs.
        </p>
        <p>
          Placeholder content: Explain core concepts, methodology, and how SSC
          relates to other humanitarian classification systems.
        </p>
        <p>
          Visuals or diagrams may be added here to explain the framework in a
          user-friendly way.
        </p>
      </div>
    </div>
  );
}
