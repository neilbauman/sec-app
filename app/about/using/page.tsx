// app/about/using/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function UsingSSCPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="using"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About", href: "/about" },
          { label: "Using" },
        ]}
      />

      <div className="prose max-w-none">
        <p>
          <strong>Using the SSC Toolset:</strong> This page offers guidelines
          on how to effectively use the SSC framework and its digital tools.
        </p>
        <ul>
          <li>Step-by-step instructions for new users.</li>
          <li>Links to training materials or help resources.</li>
          <li>Best practices for applying SSC in different contexts.</li>
        </ul>
        <p>
          Placeholder content: Insert detailed user instructions and examples
          of SSC workflows here.
        </p>
      </div>
    </div>
  );
}
