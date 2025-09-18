// app/about/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "About" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}   // ✅ JSX element
        icon={<Info className="w-5 h-5 text-rust-600" />}        // ✅ JSX element
        breadcrumbs={breadcrumbs}
      />
      <div className="mt-6 text-gray-700">
        <p>
          The Shelter and Settlement Severity Classification (SSC) provides a structured
          framework for analyzing and visualizing shelter conditions across different
          contexts. It enables practitioners to manage indicators, frameworks, and
          instances consistently.
        </p>
        <p className="mt-4">
          This page will later include diagrams and additional guidance content to help
          users understand how the SSC is designed and applied in practice.
        </p>
      </div>
    </main>
  );
}
