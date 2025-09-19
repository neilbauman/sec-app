// app/about/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function AboutIndexPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="index"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="prose max-w-none">
        <p>
          <strong>About the SSC Toolset:</strong> This section provides
          background on the Shelter and Settlement Severity Classification
          (SSC) framework, its development, and how it supports humanitarian
          response.
        </p>
        <p>
          Placeholder content: Add historical context, development process,
          and key principles of SSC here.
        </p>
      </div>
    </div>
  );
}
