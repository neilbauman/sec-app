// app/about/using/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function UsingToolsetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="using"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "Using the Toolset" },
        ]}
      />

      <div className="prose max-w-none">
        <p>
          The SSC Toolset is designed for field teams and decision-makers to assess, classify, and communicate the
          severity of shelter and settlement needs.
        </p>
        <ul>
          <li>Use the <strong>Indicator Question Bank</strong> for data collection and analysis.</li>
          <li>Refer to the <strong>Cheatsheet</strong> for quick guidance during assessments.</li>
          <li>Follow the <strong>Implementation Guidelines</strong> for a full methodological walkthrough.</li>
        </ul>
        <p>
          Together, these tools provide a structured, consistent way of assessing humanitarian shelter situations.
        </p>
      </div>
    </div>
  );
}
