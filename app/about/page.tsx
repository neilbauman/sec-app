// /app/about/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "About" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the SSC and toolset."
        group="About"
        breadcrumbs={breadcrumbs}
      />
      <div className="mt-6 space-y-4">
        <p>
          The Shelter and Settlement Severity Classification (SSC) toolset
          provides a structured way to assess, configure, and analyze
          humanitarian shelter and settlement needs.
        </p>
        <p>
          This page will eventually include diagrams and further explanatory
          content about the SSC methodology and the toolset’s structure.
        </p>
        <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400">
          [Placeholder for diagram/image]
        </div>
      </div>
    </main>
  );
}
